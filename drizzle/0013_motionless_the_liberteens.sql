ALTER TABLE `payments` ADD `paypalVaultPaymentSource` enum('card','apple_pay');--> statement-breakpoint
ALTER TABLE `payments` ADD `paypalApplePayConsentAt` timestamp;