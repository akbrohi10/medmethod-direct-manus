ALTER TABLE `payments` ADD `consultationTotalAmount` int DEFAULT 19900 NOT NULL;--> statement-breakpoint
ALTER TABLE `payments` ADD `referralCode` varchar(64);--> statement-breakpoint
ALTER TABLE `payments` ADD `referralCreditAmount` int DEFAULT 0 NOT NULL;