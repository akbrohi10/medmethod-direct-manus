CREATE TABLE `intake_private_blob_chunks` (
	`keyHash` varchar(64) NOT NULL,
	`chunkIndex` int NOT NULL,
	`ciphertext` mediumblob NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intake_private_blob_chunks_keyHash_chunkIndex_pk` PRIMARY KEY(`keyHash`,`chunkIndex`)
);
--> statement-breakpoint
CREATE TABLE `intake_private_blob_locks` (
	`nameHash` varchar(64) NOT NULL,
	`owner` varchar(64) NOT NULL,
	`expiresAt` bigint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intake_private_blob_locks_nameHash` PRIMARY KEY(`nameHash`)
);
--> statement-breakpoint
CREATE TABLE `intake_private_blobs` (
	`keyHash` varchar(64) NOT NULL,
	`keyCiphertext` mediumblob NOT NULL,
	`revision` int NOT NULL DEFAULT 1,
	`expiresAt` bigint NOT NULL,
	`chunkCount` int NOT NULL,
	`byteLength` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intake_private_blobs_keyHash` PRIMARY KEY(`keyHash`)
);
--> statement-breakpoint
-- TiDB TTL is asynchronous physical cleanup on the provider schedule. Application reads enforce exact expiresAt.
ALTER TABLE `intake_private_blobs` TTL = `createdAt` + INTERVAL 24 HOUR TTL_ENABLE = 'ON';
--> statement-breakpoint
ALTER TABLE `intake_private_blob_chunks` TTL = `createdAt` + INTERVAL 24 HOUR TTL_ENABLE = 'ON';
--> statement-breakpoint
ALTER TABLE `intake_private_blob_locks` TTL = `createdAt` + INTERVAL 24 HOUR TTL_ENABLE = 'ON';
