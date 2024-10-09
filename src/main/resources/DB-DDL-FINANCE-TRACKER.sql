CREATE TABLE `finance-tracker`.`cat` (
  `cat_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `cat_type` tinyint NOT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `finance-tracker`.`mov` (
  `mov_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `date` date NOT NULL,
  `isIncome` tinyint NOT NULL,
  PRIMARY KEY (`mov_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `finance-tracker`.`mov_cat` (
  `mov_id` bigint unsigned NOT NULL,
  `cat_id` bigint unsigned NOT NULL,
  UNIQUE KEY `unique_mov_cat_ids` (`mov_id`,`cat_id`),
  KEY `fk_cat_id` (`cat_id`),
  CONSTRAINT `fk_cat_id` FOREIGN KEY (`cat_id`) REFERENCES `cat` (`cat_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mov_id` FOREIGN KEY (`mov_id`) REFERENCES `mov` (`mov_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table representing N to M relationship between mov table and cat table';