CREATE TABLE `ghl_intake_webhook_outbox` (
	`eventKey` varchar(64) NOT NULL,
	`encryptedPayload` mediumblob,
	`status` enum('pending','processing','sent','failed') NOT NULL DEFAULT 'pending',
	`attempts` int NOT NULL DEFAULT 0,
	`leaseOwner` varchar(64),
	`leaseExpiresAt` bigint,
	`createdAt` bigint NOT NULL,
	`terminalExpiresAt` bigint,
	CONSTRAINT `ghl_intake_webhook_outbox_eventKey` PRIMARY KEY(`eventKey`)
);
--> statement-breakpoint
CREATE INDEX `ghl_intake_outbox_claim_idx` ON `ghl_intake_webhook_outbox` (`status`,`leaseExpiresAt`);--> statement-breakpoint
CREATE INDEX `ghl_intake_outbox_retention_idx` ON `ghl_intake_webhook_outbox` (`status`,`terminalExpiresAt`);