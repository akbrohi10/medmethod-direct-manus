-- MedMethod Direct schema-only export for a NEW, EMPTY MySQL 8/TiDB database.
-- Contains no patient, payment, admin credential, or other production records.
-- Generated from drizzle/schema.ts on 2026-08-23.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `openId` VARCHAR(64) NOT NULL,
  `name` TEXT NULL,
  `email` VARCHAR(320) NULL,
  `loginMethod` VARCHAR(64) NULL,
  `role` ENUM('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_openId_unique` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stripe_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mode` ENUM('test','live') NOT NULL DEFAULT 'test',
  `testPublishableKey` TEXT NULL,
  `testSecretKey` TEXT NULL,
  `livePublishableKey` TEXT NULL,
  `liveSecretKey` TEXT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `patientName` VARCHAR(255) NULL,
  `patientEmail` VARCHAR(320) NULL,
  `patientPhone` VARCHAR(32) NULL,
  `appointmentDate` BIGINT NULL,
  `depositAmount` INT NOT NULL DEFAULT 5000,
  `remainingAmount` INT NOT NULL DEFAULT 14900,
  `stripeCustomerId` VARCHAR(64) NULL,
  `stripePaymentMethodId` VARCHAR(64) NULL,
  `depositPaymentIntentId` VARCHAR(64) NULL,
  `scheduledChargePaymentIntentId` VARCHAR(64) NULL,
  `status` ENUM('pending','deposit_paid','fully_paid','failed') NOT NULL DEFAULT 'pending',
  `landingPage` VARCHAR(64) NULL,
  `scheduledChargePaymentCronTaskUid` VARCHAR(65) NULL,
  `stripeMode` ENUM('test','live') NOT NULL DEFAULT 'test',
  `paymentProvider` ENUM('stripe','paypal') NOT NULL DEFAULT 'stripe',
  `paypalOrderId` VARCHAR(64) NULL,
  `paypalRemainingOrderId` VARCHAR(64) NULL,
  `paypalMode` ENUM('sandbox','live') NULL DEFAULT 'sandbox',
  `paypalVaultToken` VARCHAR(128) NULL,
  `paypalCustomerId` VARCHAR(128) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `super_admin_credentials` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(320) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `super_admin_credentials_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payment_webhook_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `transactionId` VARCHAR(128) NOT NULL,
  `landingPagePath` VARCHAR(64) NOT NULL,
  `attemptNumber` INT NOT NULL DEFAULT 1,
  `requestBody` TEXT NOT NULL,
  `httpStatus` INT NOT NULL DEFAULT 0,
  `responseBody` TEXT NULL,
  `errorMessage` TEXT NULL,
  `success` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `paypal_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mode` ENUM('sandbox','live') NOT NULL DEFAULT 'sandbox',
  `activeProvider` ENUM('stripe','paypal') NOT NULL DEFAULT 'stripe',
  `sandboxClientId` TEXT NULL,
  `sandboxClientSecret` TEXT NULL,
  `liveClientId` TEXT NULL,
  `liveClientSecret` TEXT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Intentionally no INSERT statements. Configure payment/provider settings
-- through the admin UI after secrets are safely added to the new environment.
