CREATE TABLE `care_team_booking_calendar_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactIdHash` varchar(64) NOT NULL,
	`startAt` bigint NOT NULL,
	`timezone` varchar(100) NOT NULL,
	`location` text,
	`expiresAt` bigint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `care_team_booking_calendar_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `care_team_booking_calendar_events_contactIdHash_unique` UNIQUE(`contactIdHash`)
);
