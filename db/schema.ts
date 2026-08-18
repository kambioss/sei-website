import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteContent = sqliteTable("site_content", {
  key: text("key").primaryKey(),
  content: text("content").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: text("updated_by").notNull(),
});

export const newsArticles = sqliteTable("news_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  excerptFr: text("excerpt_fr").notNull(),
  excerptEn: text("excerpt_en").notNull(),
  bodyFr: text("body_fr").notNull(),
  bodyEn: text("body_en").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  coverAltFr: text("cover_alt_fr").notNull(),
  coverAltEn: text("cover_alt_en").notNull(),
  publishedAt: text("published_at").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const newsImages = sqliteTable("news_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  articleId: integer("article_id")
    .notNull()
    .references(() => newsArticles.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altFr: text("alt_fr").notNull(),
  altEn: text("alt_en").notNull(),
  position: integer("position").notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en").notNull(),
  excerptFr: text("excerpt_fr").notNull(),
  excerptEn: text("excerpt_en").notNull(),
  bodyFr: text("body_fr").notNull(),
  bodyEn: text("body_en").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  coverAltFr: text("cover_alt_fr").notNull(),
  coverAltEn: text("cover_alt_en").notNull(),
  publishedAt: text("published_at").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
