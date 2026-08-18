export async function resolve(specifier, context, nextResolve) {
  if (specifier === "cloudflare:workers") {
    return {
      url: "data:text/javascript,export const env = {};",
      shortCircuit: true,
    };
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === "cloudflare:workers") {
    return {
      format: "module",
      source: "export const env = {};",
      shortCircuit: true,
    };
  }

  return nextLoad(url, context);
}
