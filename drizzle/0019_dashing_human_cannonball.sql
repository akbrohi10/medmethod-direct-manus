CREATE TABLE `intake_text_payment_worker` (
	`id` int NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`enabled` int NOT NULL DEFAULT 0,
	CONSTRAINT `intake_text_payment_worker_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intake_text_payments` (
	`keyHash` varchar(64) NOT NULL,
	`rowType` enum('guard','record') NOT NULL,
	`version` int NOT NULL DEFAULT 0,
	`encryptedRecord` mediumblob,
	`expiresAt` bigint NOT NULL,
	`retentionUntil` bigint,
	`createdAt` bigint NOT NULL,
	`nextSweepAt` bigint NOT NULL,
	`state` varchar(32) NOT NULL,
	`paymentTokenHash` varchar(64),
	`resumeTokenHash` varchar(64),
	CONSTRAINT `intake_text_payments_keyHash` PRIMARY KEY(`keyHash`)
);
--> statement-breakpoint
CREATE INDEX `text_payment_worker_uid_idx` ON `intake_text_payment_worker` (`scheduleCronTaskUid`);--> statement-breakpoint
CREATE INDEX `text_payment_token_idx` ON `intake_text_payments` (`rowType`,`paymentTokenHash`);--> statement-breakpoint
CREATE INDEX `text_resume_token_idx` ON `intake_text_payments` (`rowType`,`resumeTokenHash`);--> statement-breakpoint
CREATE INDEX `text_payment_due_idx` ON `intake_text_payments` (`rowType`,`state`,`nextSweepAt`);