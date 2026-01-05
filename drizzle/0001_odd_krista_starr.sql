CREATE TABLE `comfortMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`emotionalContext` varchar(100) NOT NULL,
	`message` text NOT NULL,
	`author` varchar(255),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comfortMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `letters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`petId` int NOT NULL,
	`petName` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`emotionalKeywords` text,
	`status` enum('sent','processing','replied') NOT NULL DEFAULT 'sent',
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `letters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`letterId` int NOT NULL,
	`userId` int NOT NULL,
	`petName` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`emotionalTone` varchar(100),
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`scheduledFor` timestamp,
	`notifiedAt` timestamp,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `replies_id` PRIMARY KEY(`id`)
);
