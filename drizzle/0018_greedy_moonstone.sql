CREATE TABLE `hormone_quiz_deliveries` (
	`quizId` varchar(36) NOT NULL,
	`provider` enum('keragon','ghl') NOT NULL,
	`status` enum('pending','processing','sent','failed') NOT NULL DEFAULT 'pending',
	`attempts` int NOT NULL DEFAULT 0,
	`maxAttempts` int NOT NULL DEFAULT 2,
	`nextAttemptAt` bigint NOT NULL,
	`leaseOwner` varchar(64),
	`leaseExpiresAt` bigint,
	`httpStatus` int NOT NULL DEFAULT 0,
	CONSTRAINT `hormone_quiz_deliveries_quizId_provider_pk` PRIMARY KEY(`quizId`,`provider`)
);
--> statement-breakpoint
CREATE TABLE `hormone_quiz_records` (
	`quizId` varchar(36) NOT NULL,
	`requestKeyHash` varchar(64) NOT NULL,
	`encryptedRecord` mediumblob NOT NULL,
	`submittedAt` bigint NOT NULL,
	`isTest` int NOT NULL DEFAULT 0,
	CONSTRAINT `hormone_quiz_records_quizId` PRIMARY KEY(`quizId`),
	CONSTRAINT `hormone_quiz_records_requestKeyHash_unique` UNIQUE(`requestKeyHash`)
);
--> statement-breakpoint
CREATE INDEX `hormone_quiz_delivery_due_idx` ON `hormone_quiz_deliveries` (`status`,`nextAttemptAt`,`leaseExpiresAt`);