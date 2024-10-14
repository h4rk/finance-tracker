-- Insert movements into the mov table
-- Assuming the table structure is as follows:
-- CREATE TABLE mov (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     date DATE,
--     description VARCHAR(255),
--     amount DECIMAL(10, 2),
--     isIncome BOOLEAN
-- );

-- Insert movements with hardcoded amounts and dates for consistent dummy data

INSERT INTO `finance-tracker`.`mov` (`date`, `description`, `amount`, `isIncome`) VALUES
-- January 2023
('2023-01-05', 'Income description 1 for 1/2023', 100.00, TRUE),
('2023-01-15', 'Income description 2 for 1/2023', 200.00, TRUE),
('2023-01-25', 'Income description 3 for 1/2023', 300.00, TRUE),
('2023-01-05', 'Expense description 1 for 1/2023', 50.00, FALSE),
('2023-01-15', 'Expense description 2 for 1/2023', 150.00, FALSE),
('2023-01-25', 'Expense description 3 for 1/2023', 250.00, FALSE),

-- February 2023
('2023-02-05', 'Income description 1 for 2/2023', 110.00, TRUE),
('2023-02-15', 'Income description 2 for 2/2023', 210.00, TRUE),
('2023-02-25', 'Income description 3 for 2/2023', 310.00, TRUE),
('2023-02-05', 'Expense description 1 for 2/2023', 60.00, FALSE),
('2023-02-15', 'Expense description 2 for 2/2023', 160.00, FALSE),
('2023-02-25', 'Expense description 3 for 2/2023', 260.00, FALSE),

-- March 2023
('2023-03-05', 'Income description 1 for 3/2023', 120.00, TRUE),
('2023-03-15', 'Income description 2 for 3/2023', 220.00, TRUE),
('2023-03-25', 'Income description 3 for 3/2023', 320.00, TRUE),
('2023-03-05', 'Expense description 1 for 3/2023', 70.00, FALSE),
('2023-03-15', 'Expense description 2 for 3/2023', 170.00, FALSE),
('2023-03-25', 'Expense description 3 for 3/2023', 270.00, FALSE),

-- April 2023
('2023-04-05', 'Income description 1 for 4/2023', 130.00, TRUE),
('2023-04-15', 'Income description 2 for 4/2023', 230.00, TRUE),
('2023-04-25', 'Income description 3 for 4/2023', 330.00, TRUE),
('2023-04-05', 'Expense description 1 for 4/2023', 80.00, FALSE),
('2023-04-15', 'Expense description 2 for 4/2023', 180.00, FALSE),
('2023-04-25', 'Expense description 3 for 4/2023', 280.00, FALSE),

-- May 2023
('2023-05-05', 'Income description 1 for 5/2023', 140.00, TRUE),
('2023-05-15', 'Income description 2 for 5/2023', 240.00, TRUE),
('2023-05-25', 'Income description 3 for 5/2023', 340.00, TRUE),
('2023-05-05', 'Expense description 1 for 5/2023', 90.00, FALSE),
('2023-05-15', 'Expense description 2 for 5/2023', 190.00, FALSE),
('2023-05-25', 'Expense description 3 for 5/2023', 290.00, FALSE),

-- June 2023
('2023-06-05', 'Income description 1 for 6/2023', 150.00, TRUE),
('2023-06-15', 'Income description 2 for 6/2023', 250.00, TRUE),
('2023-06-25', 'Income description 3 for 6/2023', 350.00, TRUE),
('2023-06-05', 'Expense description 1 for 6/2023', 100.00, FALSE),
('2023-06-15', 'Expense description 2 for 6/2023', 200.00, FALSE),
('2023-06-25', 'Expense description 3 for 6/2023', 300.00, FALSE),

-- July 2023
('2023-07-05', 'Income description 1 for 7/2023', 160.00, TRUE),
('2023-07-15', 'Income description 2 for 7/2023', 260.00, TRUE),
('2023-07-25', 'Income description 3 for 7/2023', 360.00, TRUE),
('2023-07-05', 'Expense description 1 for 7/2023', 110.00, FALSE),
('2023-07-15', 'Expense description 2 for 7/2023', 210.00, FALSE),
('2023-07-25', 'Expense description 3 for 7/2023', 310.00, FALSE),

-- August 2023
('2023-08-05', 'Income description 1 for 8/2023', 170.00, TRUE),
('2023-08-15', 'Income description 2 for 8/2023', 270.00, TRUE),
('2023-08-25', 'Income description 3 for 8/2023', 370.00, TRUE),
('2023-08-05', 'Expense description 1 for 8/2023', 120.00, FALSE),
('2023-08-15', 'Expense description 2 for 8/2023', 220.00, FALSE),
('2023-08-25', 'Expense description 3 for 8/2023', 320.00, FALSE),

-- September 2023
('2023-09-05', 'Income description 1 for 9/2023', 180.00, TRUE),
('2023-09-15', 'Income description 2 for 9/2023', 280.00, TRUE),
('2023-09-25', 'Income description 3 for 9/2023', 380.00, TRUE),
('2023-09-05', 'Expense description 1 for 9/2023', 130.00, FALSE),
('2023-09-15', 'Expense description 2 for 9/2023', 230.00, FALSE),
('2023-09-25', 'Expense description 3 for 9/2023', 330.00, FALSE),

-- October 2023
('2023-10-05', 'Income description 1 for 10/2023', 190.00, TRUE),
('2023-10-15', 'Income description 2 for 10/2023', 290.00, TRUE),
('2023-10-25', 'Income description 3 for 10/2023', 390.00, TRUE),
('2023-10-05', 'Expense description 1 for 10/2023', 140.00, FALSE),
('2023-10-15', 'Expense description 2 for 10/2023', 240.00, FALSE),
('2023-10-25', 'Expense description 3 for 10/2023', 340.00, FALSE);