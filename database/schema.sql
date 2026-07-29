-- ========================================================
-- HAPPY KIDS SCHOOL ADMISSION SYSTEM
-- MySQL Database Schema
-- Production-Ready SQL Script
-- ========================================================

-- Create database if not exists and switch to it
CREATE DATABASE IF NOT EXISTS `happy_kids_school`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `happy_kids_school`;

-- Disable foreign key checks temporarily during drop/recreate
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `image_references`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `parents`;
DROP TABLE IF EXISTS `students`;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- TABLE 1: STUDENTS
-- Stores core student personal information & application tracking
-- ========================================================
CREATE TABLE `students` (
  `student_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `application_number` VARCHAR(32) NOT NULL UNIQUE COMMENT 'Unique Application Ref e.g., HKS-2026-0001',
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Student Full Name (Min 3 characters)',
  `dob` DATE NOT NULL COMMENT 'Student Date of Birth (No future dates)',
  `age_years` SMALLINT UNSIGNED NOT NULL COMMENT 'Auto-calculated Years from DOB',
  `age_months` SMALLINT UNSIGNED NOT NULL COMMENT 'Auto-calculated Months from DOB',
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL COMMENT 'Student Gender',
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL COMMENT 'Blood Group',
  `mother_tongue` VARCHAR(100) NOT NULL COMMENT 'Mother Tongue',
  `photo_path` VARCHAR(255) NULL COMMENT 'Relative file path for Student Photo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record Creation Timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Modification Timestamp',
  INDEX `idx_app_number` (`application_number`),
  INDEX `idx_student_name` (`full_name`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Core Student Admission Records';

-- ========================================================
-- TABLE 2: PARENTS
-- Stores Father and Mother / Guardian information linked to student
-- ========================================================
CREATE TABLE `parents` (
  `parent_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL COMMENT 'Foreign Key to Students table',
  `relation_type` ENUM('FATHER', 'MOTHER', 'GUARDIAN', 'GUARDIAN2') NOT NULL COMMENT 'Parent Relationship Type',
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Parent Full Name',
  `occupation` VARCHAR(150) NOT NULL COMMENT 'Parent Occupation',
  `mobile_number` VARCHAR(15) NOT NULL COMMENT '10-digit mobile number',
  `email` VARCHAR(150) NULL COMMENT 'Optional email address',
  `aadhaar_number` VARCHAR(20) NOT NULL COMMENT '12-digit Aadhaar identification number',
  `photo_path` VARCHAR(255) NULL COMMENT 'Relative file path for Parent Photo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_parents_student` FOREIGN KEY (`student_id`)
    REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_parent_student_id` (`student_id`),
  INDEX `idx_parent_relation` (`student_id`, `relation_type`),
  INDEX `idx_parent_mobile` (`mobile_number`),
  INDEX `idx_parent_aadhaar` (`aadhaar_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Father and Mother Details for Student Applications';

-- ========================================================
-- TABLE 3: ADDRESSES
-- Stores Residential Address linked to student application
-- ========================================================
CREATE TABLE `addresses` (
  `address_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL COMMENT 'Foreign Key to Students table',
  `house_number` VARCHAR(50) NOT NULL COMMENT 'House / Flat / Door Number',
  `street` VARCHAR(150) NOT NULL COMMENT 'Street Name / Landmark',
  `area` VARCHAR(150) NOT NULL COMMENT 'Area / Locality / Sector',
  `city` VARCHAR(100) NOT NULL COMMENT 'City / Town',
  `district` VARCHAR(100) NOT NULL COMMENT 'District Name',
  `state` VARCHAR(100) NOT NULL COMMENT 'State Name',
  `country` VARCHAR(100) NOT NULL DEFAULT 'India' COMMENT 'Country (Default: India)',
  `pin_code` VARCHAR(10) NOT NULL COMMENT '6-digit PIN Code',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_addresses_student` FOREIGN KEY (`student_id`)
    REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_address_student_id` (`student_id`),
  INDEX `idx_pin_code` (`pin_code`),
  INDEX `idx_city_state` (`city`, `state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Residential Address Records';

-- ========================================================
-- TABLE 4: IMAGE_REFERENCES
-- Stores metadata and audit trail for all uploaded photos
-- ========================================================
CREATE TABLE `image_references` (
  `image_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL COMMENT 'Foreign Key to Students table',
  `entity_type` ENUM('STUDENT', 'FATHER', 'MOTHER') NOT NULL COMMENT 'Photo Owner',
  `file_name` VARCHAR(255) NOT NULL COMMENT 'Original Uploaded File Name',
  `file_path` VARCHAR(255) NOT NULL COMMENT 'Stored File System Path (/uploads/...)',
  `file_size` INT UNSIGNED NOT NULL COMMENT 'File size in bytes (Max 5MB)',
  `mime_type` VARCHAR(50) NOT NULL COMMENT 'MIME Type (image/jpeg, image/png, image/jpg)',
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp of upload',
  CONSTRAINT `fk_images_student` FOREIGN KEY (`student_id`)
    REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_image_student_id` (`student_id`),
  INDEX `idx_image_entity` (`student_id`, `entity_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Metadata for Uploaded Student and Parent Photos';

-- End of Schema
