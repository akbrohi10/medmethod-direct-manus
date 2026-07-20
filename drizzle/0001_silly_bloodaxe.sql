CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientName` varchar(255),
	`patientEmail` varchar(320),
	`patientPhone` varchar(32),
	`appointmentDate` bigint,
	`depositAmount` int NOT NULL DEFAULT 5000,
	`remainingAmount` int NOT NULL DEFAULT 14900,
	`stripeCustomerId` varchar(64),
	`stripePaymentMethodId` varchar(64),
	`depositPaymentIntentId` varchar(64),
	`scheduledChargePaymentIntentId` varchar(64),
	`status` enum('deposit_paid','fully_paid','failed') NOT NULL DEFAULT 'deposit_paid',
	`landingPage` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stripe_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mode` enum('test','live') NOT NULL DEFAULT 'test',
	`testPublishableKey` text,
	`testSecretKey` text,
	`livePublishableKey` text,
	`liveSecretKey` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stripe_settings_id` PRIMARY KEY(`id`)
);
