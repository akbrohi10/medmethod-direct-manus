CREATE TABLE `email_delivery_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventKey` varchar(191) NOT NULL,
	`paymentId` int NOT NULL,
	`templateKey` varchar(64) NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` text NOT NULL,
	`chargedAmount` int NOT NULL,
	`appointmentDate` bigint,
	`paymentProvider` varchar(32),
	`transactionId` varchar(191),
	`status` enum('pending','sent','failed','skipped') NOT NULL DEFAULT 'pending',
	`providerMessageId` varchar(191),
	`errorMessage` text,
	`attemptNumber` int NOT NULL DEFAULT 1,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_delivery_log_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_delivery_log_eventKey_unique` UNIQUE(`eventKey`)
);
--> statement-breakpoint
CREATE TABLE `email_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enabled` int NOT NULL DEFAULT 0,
	`resendApiKeyEncrypted` text,
	`senderName` varchar(255),
	`senderEmail` varchar(320),
	`replyToEmail` varchar(320),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateKey` varchar(64) NOT NULL,
	`displayName` varchar(160) NOT NULL,
	`subject` text NOT NULL,
	`htmlBody` text NOT NULL,
	`textBody` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_templates_templateKey_unique` UNIQUE(`templateKey`)
);
