CREATE TABLE `news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title_fr` text NOT NULL,
	`title_en` text NOT NULL,
	`excerpt_fr` text NOT NULL,
	`excerpt_en` text NOT NULL,
	`body_fr` text NOT NULL,
	`body_en` text NOT NULL,
	`cover_image_url` text NOT NULL,
	`cover_alt_fr` text NOT NULL,
	`cover_alt_en` text NOT NULL,
	`published_at` text NOT NULL,
	`is_published` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_articles_slug_unique` ON `news_articles` (`slug`);--> statement-breakpoint
CREATE TABLE `news_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` integer NOT NULL,
	`url` text NOT NULL,
	`alt_fr` text NOT NULL,
	`alt_en` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `news_articles`(`id`) ON UPDATE no action ON DELETE cascade
);
