-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2023 at 04:44 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webais`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrators`
--

CREATE TABLE `administrators` (
  `id` varchar(245) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `otherNames` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `dob` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `administrators`
--

INSERT INTO `administrators` (`id`, `firstName`, `otherNames`, `lastName`, `email`, `phone`, `gender`, `dob`, `created_at`, `password`) VALUES
('ADMIN-1', 'Victor', 'Chukwuka', 'Ubere', 'victorubere@gmail.com', '09039025289', 'male', '2023-03-09 23:00:00', '2023-03-14 15:59:38', 'admin123');

-- --------------------------------------------------------

--
-- Table structure for table `annoucements`
--

CREATE TABLE `annoucements` (
  `id` int(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `created_at`) VALUES
(1, '2023-04-17 20:03:26');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `created_at`) VALUES
(9, 'Introduction To Computers', 'An introduction to computers and the ecosystem it occupies', '2023-04-19 07:50:42'),
(10, 'Computer Graphics', 'Images on computers and how they display to the users', '2023-04-19 08:00:47'),
(11, 'Computer Architecture And Organization', 'A break down of the architectural design of computers and how components work together ', '2023-04-20 19:01:57'),
(12, 'Computer Architecture And Organization', 'A break down of the architectural design of computers and how components work together ', '2023-04-20 19:01:57'),
(13, 'Public Health', 'An introduction to public health and how to keep basic hygiene', '2023-04-20 19:06:24'),
(14, 'Introduction To Programming', 'An introduction to computer programming paradigms', '2023-04-20 19:10:03'),
(15, 'English Language', 'A basic introduction to English language and its structure', '2023-04-20 19:11:59'),
(16, 'Mathematics', 'An introduction to algebra', '2023-04-20 19:21:08'),
(17, 'Engineering Mathematics', 'An introduction to differential equations and its applications', '2023-04-20 19:23:02'),
(18, 'Engineering Mathematics', 'An introduction to differential equations and its applications', '2023-04-20 19:23:02'),
(19, 'Mathematics II', 'Logarithm tables', '2023-04-20 19:24:51');

-- --------------------------------------------------------

--
-- Table structure for table `course_gradings`
--

CREATE TABLE `course_gradings` (
  `id` int(11) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `department_course_id` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `grading_open` tinyint(1) NOT NULL,
  `registration_open` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_gradings`
--

INSERT INTO `course_gradings` (`id`, `table_name`, `department_course_id`, `session`, `grading_open`, `registration_open`) VALUES
(5, 'results_2021_2022_1_19', 19, '2021/2022', 1, 1),
(6, 'results_2021_2022_1_20', 20, '2021/2022', 1, 1),
(7, 'results_2021_2022_1_21', 21, '2021/2022', 1, 1),
(8, 'results_2021_2022_1_22', 22, '2021/2022', 1, 1),
(9, 'results_2021_2022_1_23', 23, '2021/2022', 1, 1),
(10, 'results_2021_2022_1_24', 24, '2021/2022', 1, 1),
(11, 'results_2021_2022_1_25', 25, '2021/2022', 1, 1),
(12, 'results_2021_2022_1_26', 26, '2021/2022', 1, 1),
(13, 'results_2021_2022_1_27', 27, '2021/2022', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `course_registrations`
--

CREATE TABLE `course_registrations` (
  `id` int(11) NOT NULL,
  `department_course_id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `session` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_registrations`
--

INSERT INTO `course_registrations` (`id`, `department_course_id`, `student_id`, `semester`, `session`) VALUES
(1, 19, 'STU-1', 1, '2021/2022'),
(11, 20, 'STU-1', 1, '2021/2022'),
(12, 24, 'STU-1', 1, '2021/2022'),
(13, 23, 'STU-1', 1, '2021/2022'),
(14, 22, 'STU-1', 1, '2021/2022'),
(15, 21, 'STU-1', 1, '2021/2022'),
(16, 25, 'STU-1', 1, '2021/2022'),
(17, 26, 'STU-1', 1, '2021/2022'),
(18, 27, 'STU-1', 1, '2021/2022');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `duration`, `faculty_id`) VALUES
(1, 'Computer Engineering', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `department_courses`
--

CREATE TABLE `department_courses` (
  `id` int(11) NOT NULL,
  `departments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`departments`)),
  `type` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `units` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `assigned_lecturers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`assigned_lecturers`)),
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department_courses`
--

INSERT INTO `department_courses` (`id`, `departments`, `type`, `code`, `units`, `semester`, `session`, `level`, `assigned_lecturers`, `course_id`) VALUES
(19, '[1]', 'compulsory', 'COE101', 3, 1, '2021/2022', 100, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Computer Engineering\"]}]', 9),
(20, '[1]', 'compulsory', 'COE103', 3, 1, '2021/2022', 100, '[]', 10),
(21, '[1]', 'compulsory', 'COE105', 4, 1, '2021/2022', 100, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Computer Engineering\"]}]', 12),
(22, '[1]', 'compulsory', 'GST101', 1, 1, '2021/2022', 100, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Computer Engineering\"]}]', 13),
(23, '[1]', 'compulsory', 'CSC104', 2, 1, '2021/2022', 100, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Computer Engineering\"]}]', 14),
(24, '[1]', 'compulsory', 'GST103', 2, 1, '2021/2022', 100, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Computer Engineering\"]}]', 15),
(25, '[1]', 'compulsory', 'MAT101', 2, 1, '2021/2022', 100, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Computer Engineering\"]}]', 16),
(26, '[1]', 'compulsory', 'FEG105', 3, 1, '2021/2022', 100, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Computer Engineering\"]}]', 18),
(27, '[1]', 'elective', 'MATH103', 2, 1, '2021/2022', 100, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Computer Engineering\"]}]', 19);

-- --------------------------------------------------------

--
-- Table structure for table `department_units_distribution`
--

CREATE TABLE `department_units_distribution` (
  `id` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `department_id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `min_units` int(11) NOT NULL,
  `max_units` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department_units_distribution`
--

INSERT INTO `department_units_distribution` (`id`, `semester`, `session`, `department_id`, `level`, `min_units`, `max_units`) VALUES
(6, 1, '2021/2022', 1, 100, 17, 24),
(7, 1, '2022/2023', 1, 100, 18, 25);

-- --------------------------------------------------------

--
-- Table structure for table `examinations`
--

CREATE TABLE `examinations` (
  `id` int(11) NOT NULL,
  `time` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `course_id` int(11) NOT NULL,
  `lecturer_id` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `examinations`
--

INSERT INTO `examinations` (`id`, `time`, `date`, `duration`, `course_id`, `lecturer_id`, `venue`) VALUES
(1, '8:00', '2023-04-09', '2', 6, 'LECT-1', 'Computer Engineering Hall'),
(2, '8:00', '2023-04-01', '2', 8, 'LECT-1', 'COE Exam hall 1'),
(3, '9:00', '2023-04-28', '2', 26, 'LECT-1', 'Examination Hall'),
(4, '8:00', '2023-05-05', '2', 22, 'LECT-1', 'Examination Hall');

-- --------------------------------------------------------

--
-- Table structure for table `faculties`
--

CREATE TABLE `faculties` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculties`
--

INSERT INTO `faculties` (`id`, `name`) VALUES
(1, 'Engineering');

-- --------------------------------------------------------

--
-- Table structure for table `fees`
--

CREATE TABLE `fees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `fee_status` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fees_paid`
--

CREATE TABLE `fees_paid` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `fee_id` int(11) NOT NULL,
  `receipt_number` varchar(255) NOT NULL,
  `confirmation_number` varchar(255) NOT NULL,
  `invoice_no` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `image` longblob NOT NULL,
  `image_name` varchar(255) NOT NULL,
  `image_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `fee_id` int(11) NOT NULL,
  `invoice_no` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lecturers`
--

CREATE TABLE `lecturers` (
  `id` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `discipline` varchar(255) NOT NULL,
  `degreeAcquired` varchar(255) NOT NULL,
  `otherNames` varchar(255) NOT NULL,
  `assigned_courses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`assigned_courses`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `dob` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lecturers`
--

INSERT INTO `lecturers` (`id`, `firstName`, `lastName`, `gender`, `email`, `password`, `phone`, `discipline`, `degreeAcquired`, `otherNames`, `assigned_courses`, `created_at`, `dob`) VALUES
('LECT-1', 'Victor', 'Ubere', 'male', 'victorubere@gmail.com', 'lect123', '09039025289', 'Computer Science', 'M.Sc', 'Chukwuka', '[]', '2023-04-14 08:01:46', '2023-03-31 23:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `lectures`
--

CREATE TABLE `lectures` (
  `id` int(11) NOT NULL,
  `time` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `day` varchar(255) NOT NULL,
  `course_id` int(11) NOT NULL,
  `lecturer_id` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lectures`
--

INSERT INTO `lectures` (`id`, `time`, `duration`, `day`, `course_id`, `lecturer_id`, `venue`) VALUES
(3, '8:00', '1', 'monday', 6, 'LECT-1', 'COE Exam hall 1'),
(4, '8:00', '1', 'monday', 8, 'LECT-1', 'COE Exam hall 1'),
(5, '8:00', '1', 'monday', 19, 'LECT-1', 'Computer Engineering Hall'),
(6, '8:00', '1', 'monday', 19, 'LECT-1', 'Computer Engineering Hall'),
(7, '10:00', '2', 'tuesday', 25, 'LECT-1', 'Engineering hall 1'),
(8, '11:00', '2', 'thursday', 19, 'LECT-1', 'computer engineering hall 3'),
(9, '13:00', '2', 'friday', 23, 'LECT-1', 'Computer Engineering Hall 5');

-- --------------------------------------------------------

--
-- Table structure for table `lecture_schedules`
--

CREATE TABLE `lecture_schedules` (
  `id` int(11) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `day` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `course_code` varchar(255) NOT NULL,
  `lecturer` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `time_sent` timestamp NOT NULL DEFAULT current_timestamp(),
  `image` varchar(2550) DEFAULT NULL,
  `seen` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `chat_id`, `user_id`, `message`, `time_sent`, `image`, `seen`) VALUES
(1, 1, 'LECT-1', 'Hello, How are you', '2023-04-21 04:35:09', NULL, 1),
(2, 1, 'STU-1', 'Good afternoon sir', '2023-04-21 14:05:56', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(255) NOT NULL,
  `details` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `targets` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`targets`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

CREATE TABLE `participants` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `chat_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`id`, `user_id`, `chat_id`) VALUES
(1, 'STU-1', 1),
(2, 'LECT-1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_7`
--

CREATE TABLE `results_2021_2022_1_7` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_8`
--

CREATE TABLE `results_2021_2022_1_8` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_9`
--

CREATE TABLE `results_2021_2022_1_9` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_19`
--

CREATE TABLE `results_2021_2022_1_19` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_19`
--

INSERT INTO `results_2021_2022_1_19` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '1', 19, 27, 6, 'C', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_20`
--

CREATE TABLE `results_2021_2022_1_20` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_20`
--

INSERT INTO `results_2021_2022_1_20` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '', 0, 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_21`
--

CREATE TABLE `results_2021_2022_1_21` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_21`
--

INSERT INTO `results_2021_2022_1_21` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '', 12, 19, 4, 'F', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_22`
--

CREATE TABLE `results_2021_2022_1_22` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_22`
--

INSERT INTO `results_2021_2022_1_22` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '', 0, 33, 6, 'F', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_23`
--

CREATE TABLE `results_2021_2022_1_23` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_23`
--

INSERT INTO `results_2021_2022_1_23` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '', 20, 65, 10, 'A', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_24`
--

CREATE TABLE `results_2021_2022_1_24` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_24`
--

INSERT INTO `results_2021_2022_1_24` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '', 18, 30, 17, 'B', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_25`
--

CREATE TABLE `results_2021_2022_1_25` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_25`
--

INSERT INTO `results_2021_2022_1_25` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '', 9, 27, 9, 'D', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_26`
--

CREATE TABLE `results_2021_2022_1_26` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_26`
--

INSERT INTO `results_2021_2022_1_26` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '', 10, 40, 9, 'C', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_1_27`
--

CREATE TABLE `results_2021_2022_1_27` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_1_27`
--

INSERT INTO `results_2021_2022_1_27` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU-1', '2021/2022', '', 12, 24, 11, 'D', '');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `current` tinyint(1) NOT NULL,
  `first_semester_start` bigint(20) NOT NULL,
  `first_semester_end` bigint(20) NOT NULL,
  `second_semester_start` bigint(20) NOT NULL,
  `second_semester_end` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `session`, `current`, `first_semester_start`, `first_semester_end`, `second_semester_start`, `second_semester_end`) VALUES
(1, '2021/2022', 0, 1681603200, 1682726400, 1682812800, 1682726400),
(5, '2022/2023', 1, 1677628800, 1682640000, 1682726400, 1683244800);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `otherNames` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` timestamp NULL DEFAULT NULL,
  `gender` varchar(255) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `entrance_session` varchar(255) NOT NULL,
  `graduation_session` varchar(255) NOT NULL,
  `created_at` int(255) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `firstName`, `lastName`, `otherNames`, `email`, `phone`, `password`, `dob`, `gender`, `faculty`, `department`, `level`, `entrance_session`, `graduation_session`, `created_at`) VALUES
('STU-1', 'Victor', 'Ubere', 'Chukwuka', 'victorubere@gmail.com', '09039025289', 'stu123', '2023-04-01 23:00:00', 'male', '1', '1', 100, '2021/2022', '2026/2027', 2147483647);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `annoucements`
--
ALTER TABLE `annoucements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_gradings`
--
ALTER TABLE `course_gradings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course_registrations`
--
ALTER TABLE `course_registrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department_courses`
--
ALTER TABLE `department_courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department_units_distribution`
--
ALTER TABLE `department_units_distribution`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `examinations`
--
ALTER TABLE `examinations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faculties`
--
ALTER TABLE `faculties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `fees`
--
ALTER TABLE `fees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fees_paid`
--
ALTER TABLE `fees_paid`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_no` (`invoice_no`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lecturers`
--
ALTER TABLE `lecturers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lectures`
--
ALTER TABLE `lectures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lecture_schedules`
--
ALTER TABLE `lecture_schedules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_7`
--
ALTER TABLE `results_2021_2022_1_7`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_8`
--
ALTER TABLE `results_2021_2022_1_8`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_9`
--
ALTER TABLE `results_2021_2022_1_9`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_19`
--
ALTER TABLE `results_2021_2022_1_19`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_20`
--
ALTER TABLE `results_2021_2022_1_20`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_21`
--
ALTER TABLE `results_2021_2022_1_21`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_22`
--
ALTER TABLE `results_2021_2022_1_22`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_23`
--
ALTER TABLE `results_2021_2022_1_23`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_24`
--
ALTER TABLE `results_2021_2022_1_24`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_25`
--
ALTER TABLE `results_2021_2022_1_25`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_26`
--
ALTER TABLE `results_2021_2022_1_26`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_1_27`
--
ALTER TABLE `results_2021_2022_1_27`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session` (`session`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `annoucements`
--
ALTER TABLE `annoucements`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `course_gradings`
--
ALTER TABLE `course_gradings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `course_registrations`
--
ALTER TABLE `course_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `department_courses`
--
ALTER TABLE `department_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `department_units_distribution`
--
ALTER TABLE `department_units_distribution`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `examinations`
--
ALTER TABLE `examinations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `faculties`
--
ALTER TABLE `faculties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `fees`
--
ALTER TABLE `fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fees_paid`
--
ALTER TABLE `fees_paid`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lectures`
--
ALTER TABLE `lectures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `lecture_schedules`
--
ALTER TABLE `lecture_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_7`
--
ALTER TABLE `results_2021_2022_1_7`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_8`
--
ALTER TABLE `results_2021_2022_1_8`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_9`
--
ALTER TABLE `results_2021_2022_1_9`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_19`
--
ALTER TABLE `results_2021_2022_1_19`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_20`
--
ALTER TABLE `results_2021_2022_1_20`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_21`
--
ALTER TABLE `results_2021_2022_1_21`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_22`
--
ALTER TABLE `results_2021_2022_1_22`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_23`
--
ALTER TABLE `results_2021_2022_1_23`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_24`
--
ALTER TABLE `results_2021_2022_1_24`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_25`
--
ALTER TABLE `results_2021_2022_1_25`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_26`
--
ALTER TABLE `results_2021_2022_1_26`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_1_27`
--
ALTER TABLE `results_2021_2022_1_27`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
