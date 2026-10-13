CREATE TABLE `intake_delivery_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keragonWebhookUrlEncrypted` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `intake_delivery_settings_id` PRIMARY KEY(`id`)
);
