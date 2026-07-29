-- ========================================================
-- TN HAPPY KIDS SCHOOL – RFID CARD MANAGEMENT MODULE
-- MySQL Database Schema: rfid_cards + access_logs
-- ========================================================

USE `happy_kids_school`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `access_logs`;
DROP TABLE IF EXISTS `rfid_cards`;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- TABLE: rfid_cards
-- Stores one RFID card per family member per student
-- ========================================================
CREATE TABLE `rfid_cards` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id`        INT UNSIGNED NOT NULL    COMMENT 'FK → students.student_id',
  `parent_id`         INT UNSIGNED NULL        COMMENT 'FK → parents.parent_id (NULL for fallback)',
  `relationship`      ENUM('FATHER','MOTHER','GUARDIAN','GUARDIAN2') NOT NULL,
  `holder_name`       VARCHAR(150) NOT NULL    COMMENT 'Full name of card holder',
  `holder_photo`      VARCHAR(255) NULL        COMMENT 'Path to holder photo',
  `card_number`       VARCHAR(32)  NOT NULL UNIQUE COMMENT 'e.g. HKS-CARD-2026-0001',
  `unique_card_id`    VARCHAR(36)  NOT NULL UNIQUE COMMENT 'UUID v4',
  `rfid_serial`       VARCHAR(64)  NOT NULL UNIQUE COMMENT 'e.g. RFID-TN-000001',
  `qr_payload`        TEXT         NOT NULL    COMMENT 'JSON payload encoded in QR code',
  `issue_date`        DATE         NOT NULL    COMMENT 'Card issue date',
  `expiry_date`       DATE         NOT NULL    COMMENT 'Card expiry date (1 year from issue)',
  `status`            ENUM('ACTIVE','INACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  `activation_date`   TIMESTAMP    NULL        COMMENT 'When card was first activated',
  `last_scan_time`    TIMESTAMP    NULL        COMMENT 'Most recent scan timestamp',
  `created_at`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rfid_student`
    FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rfid_parent`
    FOREIGN KEY (`parent_id`) REFERENCES `parents`(`parent_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_rfid_student`      (`student_id`),
  INDEX `idx_rfid_relationship` (`student_id`, `relationship`),
  INDEX `idx_rfid_status`       (`status`),
  INDEX `idx_rfid_serial`       (`rfid_serial`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='RFID Family Access Cards for School Entry/Exit Control';

-- ========================================================
-- TABLE: access_logs
-- Records every card scan event at school gates
-- ========================================================
CREATE TABLE `access_logs` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `card_id`     INT UNSIGNED NOT NULL    COMMENT 'FK → rfid_cards.id',
  `student_id`  INT UNSIGNED NOT NULL    COMMENT 'FK → students.student_id',
  `scan_type`   ENUM('ENTRY','EXIT','VERIFY') NOT NULL DEFAULT 'ENTRY',
  `gate`        VARCHAR(100) NULL        COMMENT 'e.g. Main Gate, Side Gate',
  `scanned_by`  VARCHAR(150) NULL        COMMENT 'Security staff name',
  `scan_time`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `device_id`   VARCHAR(64)  NULL        COMMENT 'RFID reader device ID',
  `remarks`     VARCHAR(255) NULL        COMMENT 'Optional notes',
  CONSTRAINT `fk_log_card`
    FOREIGN KEY (`card_id`) REFERENCES `rfid_cards`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_log_student`
    FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_log_card`     (`card_id`),
  INDEX `idx_log_student`  (`student_id`),
  INDEX `idx_log_scantime` (`scan_time`),
  INDEX `idx_log_scantype` (`scan_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Access Log: Every RFID Scan Event at School Gates';
