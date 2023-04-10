-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2023 at 07:07 PM
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

--
-- Dumping data for table `annoucements`
--

INSERT INTO `annoucements` (`id`, `type`, `title`, `content`, `target`, `time`, `date`, `created_at`) VALUES
(1, 'alert', 'School Resumption', 'School would be resuming activities on the 23rd of march and all who it concerns are expected to resume artivities on that day. Thank you', 'students', '00:00:00', '2023-03-23', '2023-03-20 03:41:46'),
(2, 'alert', 'School Examinations', 'School would be starting examinations on the 31st of march and would like all participants to begin preparations.\nStay at alert as your examinations schedules would be uploaded promptly.', 'all', '00:00:00', '2023-03-31', '2023-03-20 03:45:44');

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
(8, '2023-04-08 19:05:20'),
(9, '2023-04-08 19:51:04'),
(10, '2023-04-08 19:51:05'),
(11, '2023-04-08 19:52:36'),
(12, '2023-04-08 19:52:36'),
(13, '2023-04-08 19:54:13'),
(14, '2023-04-08 21:08:58'),
(15, '2023-04-08 21:08:58'),
(16, '2023-04-08 21:08:58'),
(17, '2023-04-08 21:45:02'),
(18, '2023-04-08 21:45:02'),
(19, '2023-04-09 07:26:40'),
(20, '2023-04-09 08:37:54'),
(21, '2023-04-09 08:37:54'),
(22, '2023-04-09 08:37:55'),
(23, '2023-04-09 08:37:55'),
(24, '2023-04-09 08:37:56'),
(25, '2023-04-09 08:37:56'),
(26, '2023-04-09 08:37:57'),
(27, '2023-04-09 08:37:57'),
(28, '2023-04-09 08:37:58'),
(29, '2023-04-09 08:37:58'),
(30, '2023-04-09 08:37:59'),
(31, '2023-04-09 08:37:59'),
(32, '2023-04-09 08:38:00'),
(33, '2023-04-09 08:38:00'),
(34, '2023-04-09 08:38:01'),
(35, '2023-04-09 08:38:01'),
(36, '2023-04-09 08:38:02'),
(37, '2023-04-09 08:38:02'),
(38, '2023-04-09 18:44:13');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `unit` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `semester` int(33) NOT NULL,
  `departments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`departments`)),
  `faculties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`faculties`)),
  `level` int(255) NOT NULL,
  `lecturers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`lecturers`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `code`, `title`, `unit`, `description`, `semester`, `departments`, `faculties`, `level`, `lecturers`, `created_at`) VALUES
(43, 'SCS201', 'Social Relations', 2, 'A course on socialization', 2, '[1,3]', '[8]', 200, '[]', '2023-04-08 10:27:07'),
(44, 'SCS202', 'Social Investigation', 2, 'A course on socialization', 2, '[3,1]', '[8]', 200, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Sociology and Human Relations\",\"Political Science\"]}]', '2023-04-08 11:07:43'),
(45, 'SCS204', 'Social Discordiance', 2, 'A course on discord', 2, '[1,3]', '[8]', 200, '[{\"id\":\"LECT-1\",\"assigned_departments\":[\"Sociology and Human Relations\",\"Political Science\"]}]', '2023-04-08 11:13:42');

-- --------------------------------------------------------

--
-- Table structure for table `course_gradings`
--

CREATE TABLE `course_gradings` (
  `id` int(11) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `course_id` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `grading_open` tinyint(1) NOT NULL,
  `registration_open` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_gradings`
--

INSERT INTO `course_gradings` (`id`, `table_name`, `course_id`, `session`, `grading_open`, `registration_open`) VALUES
(1, 'results_2021_2022_2_42', 42, '2021/2022', 1, 1),
(2, 'results_2021_2022_2_43', 43, '2021/2022', 1, 1),
(3, 'results_2021_2022_2_44', 44, '2021/2022', 1, 1),
(4, 'results_2021_2022_2_45', 45, '2021/2022', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `course_id_session_grading`
--

CREATE TABLE `course_id_session_grading` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `examination` varchar(255) NOT NULL,
  `continious_assessment` int(11) NOT NULL,
  `attendance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_registrations`
--

CREATE TABLE `course_registrations` (
  `id` int(11) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `session` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_registrations`
--

INSERT INTO `course_registrations` (`id`, `course_id`, `student_id`, `semester`, `session`) VALUES
(3, '43', 'STU_7', 2, '2021/2022'),
(4, '44', 'STU_7', 2, '2021/2022'),
(5, '45', 'STU_7', 2, '2021/2022'),
(6, '44', 'STU_8', 2, '2021/2022');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `faculty_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `faculty_id`) VALUES
(1, 'Sociology and Human Relations', 8),
(3, 'Political Science', 8);

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
(2, '8:00', '2023-03-03', '2', 40, 'LECT-1', 'Computer Engineering Hall'),
(3, '12:00', '2023-04-03', '2', 39, 'LECT-1', 'COE Exam hall 1');

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
(9, 'Business and Administration'),
(7, 'Education'),
(1, 'Engineering'),
(4, 'Medical Sciences'),
(5, 'Physical Sciences'),
(8, 'Social Sciences');

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

--
-- Dumping data for table `fees_paid`
--

INSERT INTO `fees_paid` (`id`, `student_id`, `fee_id`, `receipt_number`, `confirmation_number`, `invoice_no`, `date`) VALUES
(12, 'STU_7', 2, '930128650612356', '81263501295276352756025', 'WEBAIS22023310933525', '');

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

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `student_id`, `fee_id`, `invoice_no`, `status`, `date`) VALUES
(2, 'STU_7', 2, 'WEBAIS22023310933525', 'settled', 'Monday, April 10, 2023');

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
('LECT-1', 'Victor', 'Ubere', 'male', 'victorubere@gmail.com', 'lect123', '09039025289', 'Computer Engineering', 'M.Sc', 'Chukwuka', '[44,45]', '2023-04-07 14:00:57', '2023-04-07 23:00:00');

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
(17, '8:00', '2', 'tuesday', 44, 'LECT-1', 'hall 4');

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
(66, 8, 'STU_7', 'Good day sir', '2023-04-09 10:42:14', NULL, 1),
(67, 8, 'LECT-1', 'Good day hakk, how can i help you', '2023-04-09 10:42:48', NULL, 1),
(68, 8, 'STU_7', 'I need help understanding a circuit ', '2023-04-09 10:43:07', NULL, 1),
(69, 8, 'LECT-1', 'Can I see a picture of the circuit?', '2023-04-09 10:43:22', NULL, 1),
(70, 8, 'STU_7', 'ok, give me a minute', '2023-04-09 10:43:34', NULL, 1),
(71, 8, 'STU_7', 'on state of the circuit', '2023-04-09 10:44:00', 'http://localhost/webais/api/controllers/uploads/circuitOff.png', 1),
(72, 8, 'STU_7', 'off state', '2023-04-09 10:44:18', 'http://localhost/webais/api/controllers/uploads/circuitOn.png', 1),
(73, 8, 'LECT-1', 'Ok, give me a couple of days to study it, i will get back to you', '2023-04-09 10:45:18', NULL, 1),
(74, 8, 'LECT-1', 'This is circuit design right', '2023-04-09 11:02:55', NULL, 1),
(75, 8, 'LECT-1', 'right?', '2023-04-09 11:03:35', NULL, 1),
(76, 8, 'LECT-1', 'yeah?', '2023-04-09 11:04:01', NULL, 1),
(77, 38, 'STU_8', 'Good day sir\r\n', '2023-04-09 18:44:21', NULL, 1);

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
(1, 'STU_7', 8),
(2, 'LECT-1', 8),
(11, 'undefined', 17),
(12, 'undefined', 18),
(13, 'STU_7', 17),
(14, 'STU_7', 18),
(15, 'undefined', 19),
(16, 'LECT-1', 19),
(17, 'STU_8', 38),
(18, 'LECT-1', 38);

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_2_39`
--

CREATE TABLE `results_2021_2022_2_39` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `attendance` int(11) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_2_40`
--

CREATE TABLE `results_2021_2022_2_40` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_2_40`
--

INSERT INTO `results_2021_2022_2_40` (`id`, `student_id`, `session`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(5, 'STU_1', '2021/2022', 0, 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_2_42`
--

CREATE TABLE `results_2021_2022_2_42` (
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
-- Dumping data for table `results_2021_2022_2_42`
--

INSERT INTO `results_2021_2022_2_42` (`id`, `student_id`, `session`, `semester`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU_5', '2021/2022', '', 0, 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_2_43`
--

CREATE TABLE `results_2021_2022_2_43` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_2_43`
--

INSERT INTO `results_2021_2022_2_43` (`id`, `student_id`, `session`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU_7', '2021/2022', 0, 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_2_44`
--

CREATE TABLE `results_2021_2022_2_44` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_2_44`
--

INSERT INTO `results_2021_2022_2_44` (`id`, `student_id`, `session`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU_7', '2021/2022', 0, 0, 0, '', ''),
(2, 'STU_8', '2021/2022', 0, 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `results_2021_2022_2_45`
--

CREATE TABLE `results_2021_2022_2_45` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `session` varchar(255) NOT NULL,
  `ca` int(11) NOT NULL,
  `exam` int(11) NOT NULL,
  `attendance` int(11) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `results_2021_2022_2_45`
--

INSERT INTO `results_2021_2022_2_45` (`id`, `student_id`, `session`, `ca`, `exam`, `attendance`, `grade`, `remark`) VALUES
(1, 'STU_7', '2021/2022', 0, 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `current` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `session`, `semester`, `current`) VALUES
(3, '2021/2022', 2, 1);

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
  `created_at` int(255) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `firstName`, `lastName`, `otherNames`, `email`, `phone`, `password`, `dob`, `gender`, `faculty`, `department`, `level`, `created_at`) VALUES
('STU_7', 'Hakk', 'Rubee', 'Cuuw', 'hakkrubee@gmail.com', '09039025289', 'stu123', '2023-03-31 23:00:00', 'male', '8', '1', 200, 2147483647),
('STU_8', 'Victor', 'Ubere', 'Chukwuka', 'victorubere@gmail.com', '09039025289', 'stu123', '2023-04-01 23:00:00', 'male', '8', '3', 200, 2147483647);

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
-- Indexes for table `course_id_session_grading`
--
ALTER TABLE `course_id_session_grading`
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
-- Indexes for table `results_2021_2022_2_39`
--
ALTER TABLE `results_2021_2022_2_39`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_2_40`
--
ALTER TABLE `results_2021_2022_2_40`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_2_42`
--
ALTER TABLE `results_2021_2022_2_42`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_2_43`
--
ALTER TABLE `results_2021_2022_2_43`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_2_44`
--
ALTER TABLE `results_2021_2022_2_44`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `results_2021_2022_2_45`
--
ALTER TABLE `results_2021_2022_2_45`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `course_gradings`
--
ALTER TABLE `course_gradings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `course_id_session_grading`
--
ALTER TABLE `course_id_session_grading`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_registrations`
--
ALTER TABLE `course_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `examinations`
--
ALTER TABLE `examinations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `faculties`
--
ALTER TABLE `faculties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `fees`
--
ALTER TABLE `fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `fees_paid`
--
ALTER TABLE `fees_paid`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lectures`
--
ALTER TABLE `lectures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `lecture_schedules`
--
ALTER TABLE `lecture_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `results_2021_2022_2_39`
--
ALTER TABLE `results_2021_2022_2_39`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `results_2021_2022_2_40`
--
ALTER TABLE `results_2021_2022_2_40`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `results_2021_2022_2_42`
--
ALTER TABLE `results_2021_2022_2_42`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_2_43`
--
ALTER TABLE `results_2021_2022_2_43`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `results_2021_2022_2_44`
--
ALTER TABLE `results_2021_2022_2_44`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `results_2021_2022_2_45`
--
ALTER TABLE `results_2021_2022_2_45`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
