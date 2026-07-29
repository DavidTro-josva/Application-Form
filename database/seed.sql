-- ========================================================
-- HAPPY KIDS SCHOOL ADMISSION SYSTEM
-- MySQL Database Seeding Script (Sample Data for Testing)
-- ========================================================

USE `happy_kids_school`;

-- Disable foreign key checks while cleaning up old seed data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `image_references`;
TRUNCATE TABLE `addresses`;
TRUNCATE TABLE `parents`;
TRUNCATE TABLE `students`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Sample Student
INSERT INTO `students` (
  `student_id`, `application_number`, `full_name`, `dob`, 
  `age_years`, `age_months`, `gender`, `blood_group`, 
  `mother_tongue`, `photo_path`
) VALUES (
  1, 'HKS-2026-0001', 'Aarav Sharma', '2021-04-15',
  5, 3, 'Male', 'O+', 'Hindi', '/uploads/sample-student.png'
);

-- 2. Insert Father Details
INSERT INTO `parents` (
  `student_id`, `relation_type`, `full_name`, `occupation`, 
  `mobile_number`, `email`, `aadhaar_number`, `photo_path`
) VALUES (
  1, 'FATHER', 'Rajesh Sharma', 'Senior Software Engineer', 
  '9876543210', 'rajesh.sharma@example.com', '123456789012', '/uploads/sample-father.png'
);

-- 3. Insert Mother Details
INSERT INTO `parents` (
  `student_id`, `relation_type`, `full_name`, `occupation`, 
  `mobile_number`, `email`, `aadhaar_number`, `photo_path`
) VALUES (
  1, 'MOTHER', 'Priya Sharma', 'Pediatrician', 
  '9876543211', 'priya.sharma@example.com', '123456789013', '/uploads/sample-mother.png'
);

-- 4. Insert Residential Address
INSERT INTO `addresses` (
  `student_id`, `house_number`, `street`, `area`, 
  `city`, `district`, `state`, `country`, `pin_code`
) VALUES (
  1, '42-B', 'Green Valley Boulevard', 'Indiranagar', 
  'Bengaluru', 'Bengaluru Urban', 'Karnataka', 'India', '560038'
);

-- 5. Insert Image Reference Records
INSERT INTO `image_references` (
  `student_id`, `entity_type`, `file_name`, `file_path`, `file_size`, `mime_type`
) VALUES 
  (1, 'STUDENT', 'sample-student.png', '/uploads/sample-student.png', 245000, 'image/png'),
  (1, 'FATHER', 'sample-father.png', '/uploads/sample-father.png', 312000, 'image/png'),
  (1, 'MOTHER', 'sample-mother.png', '/uploads/sample-mother.png', 298000, 'image/png');

-- End of Seed Script
