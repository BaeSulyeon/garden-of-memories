CREATE TABLE `chrysanthemumTributes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`tributeCount` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chrysanthemumTributes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comfortComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`isAnonymous` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comfortComments_id` PRIMARY KEY(`id`)
);
