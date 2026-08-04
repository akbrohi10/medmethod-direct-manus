CREATE TABLE `paypal_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mode` enum('sandbox','live') NOT NULL DEFAULT 'sandbox',
	`activeProvider` enum('stripe','paypal') NOT NULL DEFAULT 'stripe',
	`sandboxClientId` text,
	`sandboxClientSecret` text,
	`liveClientId` text,
	`liveClientSecret` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paypal_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `payments` ADD `paymentProvider` enum('stripe','paypal') DEFAULT 'stripe' NOT NULL;--> statement-breakpoint
ALTER TABLE `payments` ADD `paypalOrderId` varchar(64);--> statement-breakpoint
ALTER TABLE `payments` ADD `paypalRemainingOrderId` varchar(64);--> statement-breakpoint
ALTER TABLE `payments` ADD `paypalMode` enum('sandbox','live') DEFAULT 'sandbox';