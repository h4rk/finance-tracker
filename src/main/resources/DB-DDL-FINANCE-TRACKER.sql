DROP TABLE IF EXISTS `finance-tracker`.`mov_cat`;
DROP TABLE IF EXISTS `finance-tracker`.`mov`;
DROP TABLE IF EXISTS `finance-tracker`.`cat`;
DROP TABLE IF EXISTS `finance-tracker`.`cat_type`;
DROP TABLE IF EXISTS `finance-tracker`.`budget`;
DROP TABLE IF EXISTS `finance-tracker`.`user`;

CREATE TABLE `finance-tracker`.`user` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roles` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `unique_username` (`username`)
);

CREATE TABLE `finance-tracker`.`cat_type` (
  `cat_type_id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`cat_type_id`),
  UNIQUE KEY `unique_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `finance-tracker`.`cat` (
  `cat_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `cat_type` tinyint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`cat_id`),
  CONSTRAINT `fk_cat_type_id` FOREIGN KEY (`cat_type`) REFERENCES `cat_type` (`cat_type_id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_user_id_cat` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `finance-tracker`.`mov` (
  `mov_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `description` varchar(150) DEFAULT NULL,
  `date` date NOT NULL,
  `isIncome` tinyint NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`mov_id`),
  CONSTRAINT `fk_user_id_mov` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `finance-tracker`.`mov_cat` (
  `mov_id` bigint unsigned NOT NULL,
  `cat_id` bigint unsigned NOT NULL,
  UNIQUE KEY `unique_mov_cat_ids` (`mov_id`,`cat_id`),
  KEY `fk_cat_id` (`cat_id`),
  CONSTRAINT `fk_cat_id` FOREIGN KEY (`cat_id`) REFERENCES `cat` (`cat_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mov_id` FOREIGN KEY (`mov_id`) REFERENCES `mov` (`mov_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table representing N to M relationship between mov table and cat table';

CREATE TABLE `finance-tracker`.`budget` (
  `budget_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `amount` double NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`budget_id`),
  CONSTRAINT `fk_user_id_budget` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT
);

INSERT INTO `finance-tracker`.`cat_type` (`name`) VALUES ('Income'), ('Expense'), ('Both');

-- Insert default user into the user table
INSERT INTO `finance-tracker`.`user` (`username`, `password`, `roles`) VALUES
('admin', '$2a$10$WvwAjX5lXiz2mtEyhlKAJ.upvS4hxUuUxyBkVsemInekpIyrkMlkO', 'ROLE_USER,ROLE_ADMIN');