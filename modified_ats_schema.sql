CREATE TABLE `ats_applicants` (
  `applicant_id` char(36) PRIMARY KEY NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `contact_id` char(36) NOT NULL,
  `gender` ENUM ('MALE', 'FEMALE', 'OTHER') NOT NULL,
  `birth_date` DATE NOT NULL,
  `discovered_at` ENUM ('REFERRAL', 'WEBSITE', 'SOCIAL_MEDIA', 'PODCAST', 'CAREER_FAIR') NOT NULL,
  `cv_link` text,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `ats_contact_infos` (
  `contact_id` char(36) PRIMARY KEY NOT NULL,
  `applicant_id` char(36) NOT NULL,
  `mobile_number_1` varchar(15) DEFAULT NULL,
  `mobile_number_2` varchar(15) DEFAULT NULL,
  `email_1` varchar(50) UNIQUE NOT NULL,
  `email_2` varchar(50) UNIQUE DEFAULT NULL,
  `email_3` varchar(50) UNIQUE DEFAULT NULL
);

CREATE TABLE `ats_applicant_trackings` (
  `tracking_id` char(36) PRIMARY KEY NOT NULL,
  `applicant_id` char(36) NOT NULL,
  `progress_id` char(36) NOT NULL,
  `test_result` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` char(36) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(36) NOT NULL,
  `applied_source` ENUM ('INDEED', 'LINKEDIN', 'SOCIAL_MEDIA', 'SUITELIFE', 'WALK_IN', 'REFERRAL') DEFAULT NULL,
  `referrer_name` varchar(50) DEFAULT NULL,
  `company_id` char(36) NOT NULL,
  `position_id` char(36) NOT NULL
);

CREATE TABLE `ats_applicant_progress` (
  `progress_id` char(36) PRIMARY KEY NOT NULL,
  `stage` ENUM ('PRE_SCREENING', 'INTERVIEW_SCHEDULE', 'JOB_OFFER', 'UNSUCCESSFUL') NOT NULL,
  `status` ENUM ('NONE', 'TEST_SENT', 'INTERVIEW_SCHEDULE_SENT', 'FIRST_INTERVIEW', 'SECOND_INTERVIEW', 'THIRD_INTERVIEW', 'FOURTH_INTERVIEW', 'FOLLOW_UP_INTERVIEW', 'FOR_JOB_OFFER', 'JOB_OFFER_REJECTED', 'JOB_OFFER_ACCEPTED', 'WITHDREW_APPLICATION', 'BLACKLISTED', 'NOT_FIT') NOT NULL,
  `blacklisted_type` ENUM('SOFT', 'HARD') DEFAULT NULL,
  `reason` ENUM ('DID_NOT_TAKE_TEST', 'NO_SHOW', 'CULTURE_MISMATCH', 'EXPECTED_SALARY_MISMATCH', 'WORKING_SCHEDULE_MISMATCH', 'OTHER_REASONS') DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);

CREATE TABLE `ats_notifications` (
  `notification_id` char(36) PRIMARY KEY NOT NULL,
  `notification_type` ENUM ('New Applicant', 'Blacklisted Applicant', 'BLACKLISTED LIFTED') NOT NULL,
  `applicant_id` char(36),
  `is_viewed` bool DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `sl_company_jobs` (
  `job_id` char(36) PRIMARY KEY NOT NULL,
  `company_id` char(36) NOT NULL,
  `title` varchar(60) NOT NULL,
  `description` text NOT NULL,
  `employment_type` ENUM ('Full-time', 'Part-time', 'Contract') NOT NULL,
  `setup_id` char(36) NOT NULL,
  `is_open` bool NOT NULL,
  `industry_id` char(36) NOT NULL,
  `created_at` timestamp NOT NULL,
  `created_by` char(36) NOT NULL,
  `updated_at` timestamp,
  `updated_by` char(36)
);

CREATE TABLE `ats_applicant_interviews` (
  `interview_id` char(36) PRIMARY KEY NOT NULL,
  `tracking_id` char(36) NOT NULL,
  `interviewer_id` char(36) NOT NULL,
  `date_of_interview` datetime,
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `ats_interviews_notes` (
  `note_id` char(36) PRIMARY KEY NOT NULL,
  `interview_id` char(36) NOT NULL,
  `note_type` ENUM (  'DISCUSSION', 
  'FIRST INTERVIEW', 
  'SECOND INTERVIEW', 
  'THIRD INTERVIEW', 
  'FOURTH INTERVIEW', 
  'FOLLOW-UP INTERVIEW') NOT NULL,
  `note_body` text NOT NULL,
  `noted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `hris_user_accounts` (
  `user_id` char(36) PRIMARY KEY NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `user_key` varchar(50) NOT NULL,
  `is_deactivated` tinyint DEFAULT 0,
  `created_at` timestamp NOT NULL
);

CREATE TABLE `hris_user_infos` (
  `user_id` char(36) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT null,
  `last_name` varchar(50) NOT NULL,
  `extension_name` varchar(3) DEFAULT null,
  `sex` varchar(6) NOT NULL,
  `user_pic` text,
  `personal_email` varchar(100) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `birthdate` date NOT NULL
);
