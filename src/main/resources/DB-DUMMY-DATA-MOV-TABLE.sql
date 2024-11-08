-- create categories
INSERT INTO `finance-tracker`.`cat` (`name`, `cat_type`, `user_id`) VALUES
('Stipendio', 1, 1),
('Spesa', 2, 1);

-- Insert movements into the mov table
INSERT INTO `finance-tracker`.`mov` (`date`, `description`, `amount`, `isIncome`, `user_id`) VALUES
-- January 2023
('2023-01-05', 'Income description 1 for 1/2023', 100.00, TRUE, 1),
('2023-01-15', 'Income description 2 for 1/2023', 200.00, TRUE, 1),
('2023-01-25', 'Income description 3 for 1/2023', 300.00, TRUE, 1),
('2023-01-05', 'Expense description 1 for 1/2023', 50.00, FALSE, 1),
('2023-01-15', 'Expense description 2 for 1/2023', 150.00, FALSE, 1),
('2023-01-25', 'Expense description 3 for 1/2023', 250.00, FALSE, 1),

-- February 2023
('2023-02-05', 'Income description 1 for 2/2023', 110.00, TRUE, 1),
('2023-02-15', 'Income description 2 for 2/2023', 210.00, TRUE, 1),
('2023-02-25', 'Income description 3 for 2/2023', 310.00, TRUE, 1),
('2023-02-05', 'Expense description 1 for 2/2023', 60.00, FALSE, 1),
('2023-02-15', 'Expense description 2 for 2/2023', 160.00, FALSE, 1),
('2023-02-25', 'Expense description 3 for 2/2023', 260.00, FALSE, 1),

-- March 2023
('2023-03-05', 'Income description 1 for 3/2023', 120.00, TRUE, 1),
('2023-03-15', 'Income description 2 for 3/2023', 220.00, TRUE, 1),
('2023-03-25', 'Income description 3 for 3/2023', 320.00, TRUE, 1),
('2023-03-05', 'Expense description 1 for 3/2023', 70.00, FALSE, 1),
('2023-03-15', 'Expense description 2 for 3/2023', 170.00, FALSE, 1),
('2023-03-25', 'Expense description 3 for 3/2023', 270.00, FALSE, 1),

-- April 2023
('2023-04-05', 'Income description 1 for 4/2023', 130.00, TRUE, 1),
('2023-04-15', 'Income description 2 for 4/2023', 230.00, TRUE, 1),
('2023-04-25', 'Income description 3 for 4/2023', 330.00, TRUE, 1),
('2023-04-05', 'Expense description 1 for 4/2023', 80.00, FALSE, 1),
('2023-04-15', 'Expense description 2 for 4/2023', 180.00, FALSE, 1),
('2023-04-25', 'Expense description 3 for 4/2023', 280.00, FALSE, 1),

-- May 2023
('2023-05-05', 'Income description 1 for 5/2023', 140.00, TRUE, 1),
('2023-05-15', 'Income description 2 for 5/2023', 240.00, TRUE, 1),
('2023-05-25', 'Income description 3 for 5/2023', 340.00, TRUE, 1),
('2023-05-05', 'Expense description 1 for 5/2023', 90.00, FALSE, 1),
('2023-05-15', 'Expense description 2 for 5/2023', 190.00, FALSE, 1),
('2023-05-25', 'Expense description 3 for 5/2023', 290.00, FALSE, 1),

-- June 2023
('2023-06-05', 'Income description 1 for 6/2023', 150.00, TRUE, 1),
('2023-06-15', 'Income description 2 for 6/2023', 250.00, TRUE, 1),
('2023-06-25', 'Income description 3 for 6/2023', 350.00, TRUE, 1),
('2023-06-05', 'Expense description 1 for 6/2023', 100.00, FALSE, 1),
('2023-06-15', 'Expense description 2 for 6/2023', 200.00, FALSE, 1),
('2023-06-25', 'Expense description 3 for 6/2023', 300.00, FALSE, 1),

-- July 2023
('2023-07-05', 'Income description 1 for 7/2023', 160.00, TRUE, 1),
('2023-07-15', 'Income description 2 for 7/2023', 260.00, TRUE, 1),
('2023-07-25', 'Income description 3 for 7/2023', 360.00, TRUE, 1),
('2023-07-05', 'Expense description 1 for 7/2023', 110.00, FALSE, 1),
('2023-07-15', 'Expense description 2 for 7/2023', 210.00, FALSE, 1),
('2023-07-25', 'Expense description 3 for 7/2023', 310.00, FALSE, 1),

-- August 2023
('2023-08-05', 'Income description 1 for 8/2023', 170.00, TRUE, 1),
('2023-08-15', 'Income description 2 for 8/2023', 270.00, TRUE, 1),
('2023-08-25', 'Income description 3 for 8/2023', 370.00, TRUE, 1),
('2023-08-05', 'Expense description 1 for 8/2023', 120.00, FALSE, 1),
('2023-08-15', 'Expense description 2 for 8/2023', 220.00, FALSE, 1),
('2023-08-25', 'Expense description 3 for 8/2023', 320.00, FALSE, 1),

-- September 2023
('2023-09-05', 'Income description 1 for 9/2023', 180.00, TRUE, 1),
('2023-09-15', 'Income description 2 for 9/2023', 280.00, TRUE, 1),
('2023-09-25', 'Income description 3 for 9/2023', 380.00, TRUE, 1),
('2023-09-05', 'Expense description 1 for 9/2023', 130.00, FALSE, 1),
('2023-09-15', 'Expense description 2 for 9/2023', 230.00, FALSE, 1),
('2023-09-25', 'Expense description 3 for 9/2023', 330.00, FALSE, 1),

-- October 2023
('2023-10-05', 'Income description 1 for 10/2023', 190.00, TRUE, 1),
('2023-10-15', 'Income description 2 for 10/2023', 290.00, TRUE, 1),
('2023-10-25', 'Income description 3 for 10/2023', 390.00, TRUE, 1),
('2023-10-05', 'Expense description 1 for 10/2023', 140.00, FALSE, 1),
('2023-10-15', 'Expense description 2 for 10/2023', 240.00, FALSE, 1),
('2023-10-25', 'Expense description 3 for 10/2023', 340.00, FALSE, 1),

-- November 2023
('2023-11-05', 'Income description 1 for 11/2023', 200.00, TRUE, 1),
('2023-11-15', 'Income description 2 for 11/2023', 300.00, TRUE, 1),
('2023-11-25', 'Income description 3 for 11/2023', 400.00, TRUE, 1),
('2023-11-05', 'Expense description 1 for 11/2023', 150.00, FALSE, 1),
('2023-11-15', 'Expense description 2 for 11/2023', 250.00, FALSE, 1),
('2023-11-25', 'Expense description 3 for 11/2023', 350.00, FALSE, 1),

-- December 2023
('2023-12-05', 'Income description 1 for 12/2023', 210.00, TRUE, 1),
('2023-12-15', 'Income description 2 for 12/2023', 310.00, TRUE, 1),
('2023-12-25', 'Income description 3 for 12/2023', 410.00, TRUE, 1),
('2023-12-05', 'Expense description 1 for 12/2023', 160.00, FALSE, 1),
('2023-12-15', 'Expense description 2 for 12/2023', 260.00, FALSE, 1),
('2023-12-25', 'Expense description 3 for 12/2023', 360.00, FALSE, 1),

-- January 2024
('2024-01-05', 'Income description 1 for 1/2024', 220.00, TRUE, 1),
('2024-01-15', 'Income description 2 for 1/2024', 320.00, TRUE, 1),
('2024-01-25', 'Income description 3 for 1/2024', 420.00, TRUE, 1),
('2024-01-05', 'Expense description 1 for 1/2024', 170.00, FALSE, 1),
('2024-01-15', 'Expense description 2 for 1/2024', 270.00, FALSE, 1),
('2024-01-25', 'Expense description 3 for 1/2024', 370.00, FALSE, 1),

-- February 2024
('2024-02-05', 'Income description 1 for 2/2024', 230.00, TRUE, 1),
('2024-02-15', 'Income description 2 for 2/2024', 330.00, TRUE, 1),
('2024-02-25', 'Income description 3 for 2/2024', 430.00, TRUE, 1),
('2024-02-05', 'Expense description 1 for 2/2024', 180.00, FALSE, 1),
('2024-02-15', 'Expense description 2 for 2/2024', 280.00, FALSE, 1),
('2024-02-25', 'Expense description 3 for 2/2024', 380.00, FALSE, 1),

-- March 2024
('2024-03-05', 'Income description 1 for 3/2024', 240.00, TRUE, 1),
('2024-03-15', 'Income description 2 for 3/2024', 340.00, TRUE, 1),
('2024-03-25', 'Income description 3 for 3/2024', 440.00, TRUE, 1),
('2024-03-05', 'Expense description 1 for 3/2024', 190.00, FALSE, 1),
('2024-03-15', 'Expense description 2 for 3/2024', 290.00, FALSE, 1),
('2024-03-25', 'Expense description 3 for 3/2024', 390.00, FALSE, 1),

-- April 2024
('2024-04-05', 'Income description 1 for 4/2024', 250.00, TRUE, 1),
('2024-04-15', 'Income description 2 for 4/2024', 350.00, TRUE, 1),
('2024-04-25', 'Income description 3 for 4/2024', 450.00, TRUE, 1),
('2024-04-05', 'Expense description 1 for 4/2024', 200.00, FALSE, 1),
('2024-04-15', 'Expense description 2 for 4/2024', 300.00, FALSE, 1),
('2024-04-25', 'Expense description 3 for 4/2024', 400.00, FALSE, 1),

-- May 2024
('2024-05-05', 'Income description 1 for 5/2024', 260.00, TRUE, 1),
('2024-05-15', 'Income description 2 for 5/2024', 360.00, TRUE, 1),
('2024-05-25', 'Income description 3 for 5/2024', 460.00, TRUE, 1),
('2024-05-05', 'Expense description 1 for 5/2024', 210.00, FALSE, 1),
('2024-05-15', 'Expense description 2 for 5/2024', 310.00, FALSE, 1),
('2024-05-25', 'Expense description 3 for 5/2024', 410.00, FALSE, 1),

-- June 2024
('2024-06-05', 'Income description 1 for 6/2024', 270.00, TRUE, 1),
('2024-06-15', 'Income description 2 for 6/2024', 370.00, TRUE, 1),
('2024-06-25', 'Income description 3 for 6/2024', 470.00, TRUE, 1),
('2024-06-05', 'Expense description 1 for 6/2024', 220.00, FALSE, 1),
('2024-06-15', 'Expense description 2 for 6/2024', 320.00, FALSE, 1),
('2024-06-25', 'Expense description 3 for 6/2024', 420.00, FALSE, 1),

-- July 2024
('2024-07-05', 'Income description 1 for 7/2024', 280.00, TRUE, 1),
('2024-07-15', 'Income description 2 for 7/2024', 380.00, TRUE, 1),
('2024-07-25', 'Income description 3 for 7/2024', 480.00, TRUE, 1),
('2024-07-05', 'Expense description 1 for 7/2024', 230.00, FALSE, 1),
('2024-07-15', 'Expense description 2 for 7/2024', 330.00, FALSE, 1),
('2024-07-25', 'Expense description 3 for 7/2024', 430.00, FALSE, 1),

-- August 2024
('2024-08-05', 'Income description 1 for 8/2024', 290.00, TRUE, 1),
('2024-08-15', 'Income description 2 for 8/2024', 390.00, TRUE, 1),
('2024-08-25', 'Income description 3 for 8/2024', 490.00, TRUE, 1),
('2024-08-05', 'Expense description 1 for 8/2024', 240.00, FALSE, 1),
('2024-08-15', 'Expense description 2 for 8/2024', 340.00, FALSE, 1),
('2024-08-25', 'Expense description 3 for 8/2024', 440.00, FALSE, 1),

-- September 2024
('2024-09-05', 'Income description 1 for 9/2024', 300.00, TRUE, 1),
('2024-09-15', 'Income description 2 for 9/2024', 400.00, TRUE, 1),
('2024-09-25', 'Income description 3 for 9/2024', 500.00, TRUE, 1),
('2024-09-05', 'Expense description 1 for 9/2024', 250.00, FALSE, 1),
('2024-09-15', 'Expense description 2 for 9/2024', 350.00, FALSE, 1),
('2024-09-25', 'Expense description 3 for 9/2024', 450.00, FALSE, 1),

-- October 2024
('2024-10-05', 'Income description 1 for 10/2024', 310.00, TRUE, 1),
('2024-10-15', 'Income description 2 for 10/2024', 410.00, TRUE, 1),
('2024-10-23', 'Income description 3 for 10/2024', 510.00, TRUE, 1),
('2024-10-05', 'Expense description 1 for 10/2024', 260.00, FALSE, 1),
('2024-10-15', 'Expense description 2 for 10/2024', 360.00, FALSE, 1),
('2024-10-23', 'Expense description 3 for 10/2024', 460.00, FALSE, 1);


-- Insert mov_cat relationship
INSERT INTO `finance-tracker`.`mov_cat` (`mov_id`, `cat_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(6, 2),

(7, 1),
(8, 1),
(9, 1),
(10, 2),
(11, 2),
(12, 2),

(13, 1),
(14, 1),
(15, 1),
(16, 2),
(17, 2),
(18, 2),

(19, 1),
(20, 1),
(21, 1),
(22, 2),
(23, 2),
(24, 2),

(25, 1),
(26, 1),
(27, 1),
(28, 2),
(29, 2),
(30, 2),

(31, 1),
(32, 1),
(33, 1),
(34, 2),
(35, 2),
(36, 2),

(37, 1),
(38, 1),
(39, 1),
(40, 2),
(41, 2),
(42, 2),

(43, 1),
(44, 1),
(45, 1),
(46, 2),
(47, 2),
(48, 2),

(49, 1),
(50, 1),
(51, 1),
(52, 2),
(53, 2),
(54, 2),

(55, 1),
(56, 1),
(57, 1),
(58, 2),
(59, 2),
(60, 2),

(61, 1),
(62, 1),
(63, 1),
(64, 2),
(65, 2),
(66, 2),

(67, 1),
(68, 1),
(69, 1),
(70, 2),
(71, 2),
(72, 2),

(73, 1),
(74, 1),
(75, 1),
(76, 2),
(77, 2),
(78, 2),

(79, 1),
(80, 1),
(81, 1),
(82, 2),
(83, 2),
(84, 2),

(85, 1),
(86, 1),
(87, 1),
(88, 2),
(89, 2),
(90, 2),

(91, 1),
(92, 1),
(93, 1),
(94, 2),
(95, 2),
(96, 2),

(97, 1),
(98, 1),
(99, 1),
(100, 2),
(101, 2),
(102, 2),

(103, 1),
(104, 1),
(105, 1),
(106, 2),
(107, 2),
(108, 2),

(109, 1),
(110, 1),
(111, 1),
(112, 2),
(113, 2),
(114, 2),

(115, 1),
(116, 1),
(117, 1),
(118, 2),
(119, 2),
(120, 2),

(121, 1),
(122, 1),
(123, 1),
(124, 2),
(125, 2),
(126, 2),

(127, 1),
(128, 1),
(129, 1),
(130, 2),
(131, 2),
(132, 2);
