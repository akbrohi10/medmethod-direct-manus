CREATE TABLE `payment_webhook_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transactionId` varchar(128) NOT NULL,
	`landingPagePath` varchar(64) NOT NULL,
	`attemptNumber` int NOT NULL DEFAULT 1,
	`requestBody` text NOT NULL,
	`httpStatus` int NOT NULL DEFAULT 0,
	`responseBody` text,
	`errorMessage` text,
	`success` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_webhook_log_id` PRIMARY KEY(`id`)
);
