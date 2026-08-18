CREATE TABLE `projects` (
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
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);