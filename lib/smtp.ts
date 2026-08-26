import { connect } from "cloudflare:sockets";

export type SmtpMessage = {
  from: string;
  to: string;
  replyTo: string;
  replyName: string;
  subject: string;
  text: string;
};

type Socket = ReturnType<typeof connect>;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64(value: string): string {
  const bytes = encoder.encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function encodedHeader(value: string): string {
  return `=?UTF-8?B?${base64(value)}?=`;
}

function cleanHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function wrapBase64(value: string): string {
  return base64(value).match(/.{1,76}/g)?.join("\r\n") ?? "";
}

class SmtpChannel {
  private reader;
  private writer;
  private buffer = "";

  constructor(private socket: Socket) {
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
  }

  async response(expected: number[]): Promise<string> {
    while (true) {
      const lines = this.buffer.split("\r\n");
      for (let index = 0; index < lines.length - 1; index += 1) {
        if (/^\d{3} /.test(lines[index])) {
          const responseLines = lines.slice(0, index + 1);
          this.buffer = lines.slice(index + 1).join("\r\n");
          const response = responseLines.join("\n");
          const code = Number(responseLines.at(-1)?.slice(0, 3));
          if (!expected.includes(code)) throw new Error(`SMTP ${response}`);
          return response;
        }
      }

      const { value, done } = await this.reader.read();
      if (done) throw new Error("SMTP connection closed unexpectedly.");
      this.buffer += decoder.decode(value, { stream: true });
    }
  }

  async command(command: string, expected: number[]): Promise<string> {
    await this.writer.write(encoder.encode(command + "\r\n"));
    return this.response(expected);
  }

  async data(message: string): Promise<void> {
    await this.writer.write(encoder.encode(message + "\r\n.\r\n"));
    await this.response([250]);
  }

  release(): void {
    this.reader.releaseLock();
    this.writer.releaseLock();
  }
}

export async function sendSmtpMessage(password: string, message: SmtpMessage): Promise<void> {
  let socket = connect(
    { hostname: "mail.infomaniak.com", port: 587 },
    { secureTransport: "starttls" },
  );
  await socket.opened;
  let channel = new SmtpChannel(socket);

  try {
    await channel.response([220]);
    await channel.command("EHLO se-impact.com", [250]);
    await channel.command("STARTTLS", [220]);
    channel.release();

    socket = socket.startTls();
    await socket.opened;
    channel = new SmtpChannel(socket);
    await channel.command("EHLO se-impact.com", [250]);
    await channel.command("AUTH LOGIN", [334]);
    await channel.command(base64(message.from), [334]);
    await channel.command(base64(password), [235]);
    await channel.command(`MAIL FROM:<${message.from}>`, [250]);
    await channel.command(`RCPT TO:<${message.to}>`, [250, 251]);
    await channel.command("DATA", [354]);

    const headers = [
      `From: SEI Website <${message.from}>`,
      `To: ${message.to}`,
      `Reply-To: ${encodedHeader(cleanHeader(message.replyName))} <${message.replyTo}>`,
      `Subject: ${encodedHeader(cleanHeader(message.subject))}`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(message.text),
    ].join("\r\n");

    await channel.data(headers);
    await channel.command("QUIT", [221]);
  } finally {
    await socket.close().catch(() => undefined);
  }
}
