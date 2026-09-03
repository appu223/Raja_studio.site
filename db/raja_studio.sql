-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2026 at 01:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `raja_studio`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_name` varchar(50) NOT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `entity_name`, `entity_id`, `details`, `ip_address`, `created_at`) VALUES
(1, 1, 'USER_CREATE', 'users', 5, 'Created user alphonseniccori123@gmail.com with role ID 4', '::1', '2026-09-03 09:42:37'),
(2, 1, 'USER_STATUS_TOGGLE', 'users', 2, 'Toggled status for user ID 2', '::1', '2026-09-03 09:43:51'),
(3, 1, 'USER_STATUS_TOGGLE', 'users', 2, 'Toggled status for user ID 2', '::1', '2026-09-03 09:43:53'),
(4, 1, 'USER_CREATE', 'users', 6, 'Created user lini@gmail.com with role ID 2', '::1', '2026-09-03 09:44:17'),
(5, 1, 'USER_STATUS_TOGGLE', 'users', 7, 'Toggled status for user ID 7', '::1', '2026-09-03 11:27:04');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_number` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `status` enum('draft','confirmed','staff_assigned','shoot_scheduled','shoot_completed','editing','gallery_ready','delivered','closed','cancelled') DEFAULT 'draft',
  `subtotal_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `event_date` date NOT NULL,
  `event_venue` varchar(255) DEFAULT NULL,
  `special_requirements` text DEFAULT NULL,
  `created_by_user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_number`, `customer_id`, `status`, `subtotal_amount`, `discount_amount`, `total_amount`, `event_date`, `event_venue`, `special_requirements`, `created_by_user_id`, `created_at`, `updated_at`) VALUES
(1, 'BK-844328', 3, 'closed', 54400.00, 100.00, 54300.00, '2026-09-11', 'grand place hall,banglure', 'ecbasluiwq', 1, '2026-09-02 18:14:04', '2026-09-02 18:14:55'),
(2, 'BK-680564', 2, 'gallery_ready', 57000.00, 0.00, 57000.00, '2026-09-26', NULL, NULL, 1, '2026-09-02 18:28:00', '2026-09-02 18:38:25'),
(3, 'BK-244403', 3, 'draft', 37000.00, 0.00, 37000.00, '2026-09-10', 'grand mahall hosur', NULL, 5, '2026-09-03 09:54:04', '2026-09-03 09:54:04'),
(4, 'BK-617893', 3, 'draft', 37000.00, 0.00, 37000.00, '2026-09-11', 'hkdslua', NULL, 5, '2026-09-03 11:23:37', '2026-09-03 11:23:37');

-- --------------------------------------------------------

--
-- Table structure for table `booking_items`
--

CREATE TABLE `booking_items` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `service_id` int(11) DEFAULT NULL,
  `item_name_snapshot` varchar(150) NOT NULL,
  `unit_price_snapshot` decimal(10,2) NOT NULL DEFAULT 0.00,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `line_total` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `booking_items`
--

INSERT INTO `booking_items` (`id`, `booking_id`, `service_id`, `item_name_snapshot`, `unit_price_snapshot`, `quantity`, `line_total`) VALUES
(1, 1, 1, 'Candid Wedding Photography', 25000.00, 1, 25000.00),
(2, 1, 6, 'imgs', 900.00, 1, 900.00),
(3, 1, 5, 'Premium Leather Album (40 Pages)', 8500.00, 1, 8500.00),
(4, 1, 4, 'Studio Portrait Session', 5000.00, 1, 5000.00),
(5, 1, 2, 'Traditional Video Recording', 15000.00, 1, 15000.00),
(6, 2, 1, 'Candid Wedding Photography', 25000.00, 1, 25000.00),
(7, 2, 3, 'Drone Aerial Cinematography', 12000.00, 1, 12000.00),
(8, 2, 2, 'Traditional Video Recording', 15000.00, 1, 15000.00),
(9, 2, 4, 'Studio Portrait Session', 5000.00, 1, 5000.00),
(10, 3, 1, 'Candid Wedding Photography', 25000.00, 1, 25000.00),
(11, 3, 3, 'Drone Aerial Cinematography', 12000.00, 1, 12000.00),
(12, 4, 3, 'Drone Aerial Cinematography', 12000.00, 1, 12000.00),
(13, 4, 1, 'Candid Wedding Photography', 25000.00, 1, 25000.00);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `full_name`, `email`, `phone`, `alternate_phone`, `address`, `city`, `notes`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Vikram Malhotra', 'vikram.m@gmail.com', '9845012345', NULL, '124 Indiranagar 100ft Road', 'Bangalore', 'Interested in Pre-Wedding and Reception package', '2026-09-02 17:43:40', '2026-09-02 17:43:40'),
(2, 6, 'Priya Soundararajan', 'priya.soundar@yahoo.com', '9880198765', NULL, '42 Besant Nagar Beach Road', 'Chennai', 'Corporate headshots for IT company leadership', '2026-09-02 17:43:40', '2026-09-03 09:45:29'),
(3, 5, 'DARVIN', 'darvin@gmail.com', '9092038096', NULL, 'thiruvalluvar nager krishnagiri tamilnadu', 'krishnagiri', NULL, '2026-09-02 17:57:46', '2026-09-03 09:45:29'),
(4, 7, 'kannan', 'kannan@gmail.com', '9342803223', NULL, NULL, 'Hosur', NULL, '2026-09-03 11:25:56', '2026-09-03 11:25:56');

-- --------------------------------------------------------

--
-- Table structure for table `editing_deliverables`
--

CREATE TABLE `editing_deliverables` (
  `id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `booking_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `asset_type` enum('JPG Image','PNG Transparent','PDF Document / Album','DOC / Word File','Video (MP4 / Link)','ZIP Archive') NOT NULL DEFAULT 'JPG Image',
  `file_url` text NOT NULL,
  `file_size` varchar(50) DEFAULT 'High-Res Export',
  `editor_notes` text DEFAULT NULL,
  `created_by_user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `editing_deliverables`
--

INSERT INTO `editing_deliverables` (`id`, `task_id`, `booking_id`, `customer_id`, `title`, `asset_type`, `file_url`, `file_size`, `editor_notes`, `created_by_user_id`, `created_at`) VALUES
(1, 1, 2, 2, 'wedding videos - Final Export', 'JPG Image', 'data:image/jpeg;base64,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', 'High-Res 300DPI', 'Retouched, color graded, and sharpened for print.', 4, '2026-09-03 10:17:12');

-- --------------------------------------------------------

--
-- Table structure for table `editing_tasks`
--

CREATE TABLE `editing_tasks` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `assigned_editor_id` int(11) DEFAULT NULL,
  `task_name` varchar(150) NOT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `due_date` date NOT NULL,
  `status` enum('queued','raw_ingested','in_progress','qc_review','approved','revisions_needed') DEFAULT 'queued',
  `qc_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `editing_tasks`
--

INSERT INTO `editing_tasks` (`id`, `session_id`, `assigned_editor_id`, `task_name`, `priority`, `due_date`, `status`, `qc_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 'wedding videos', 'urgent', '2026-09-03', 'approved', '', '2026-09-02 18:38:10', '2026-09-02 18:38:25');

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `contact_name` varchar(150) NOT NULL,
  `contact_phone` varchar(20) NOT NULL,
  `contact_email` varchar(191) DEFAULT NULL,
  `event_type` varchar(100) NOT NULL,
  `tentative_date` date DEFAULT NULL,
  `source` varchar(50) DEFAULT 'Walk-in',
  `status` enum('new','in_progress','quoted','converted','lost') DEFAULT 'new',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enquiries`
--

INSERT INTO `enquiries` (`id`, `customer_id`, `contact_name`, `contact_phone`, `contact_email`, `event_type`, `tentative_date`, `source`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'Vikram Malhotra', '9845012345', 'vikram.m@gmail.com', 'Wedding Photography', '2026-11-20', 'Instagram', 'quoted', 'Discussed 2-day traditional + candid coverage.', '2026-09-02 17:43:40', '2026-09-02 18:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `asset_tag` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` enum('Camera Body','Lens','Lighting','Audio','Drone','Stabilizer / Grip','Accessories') NOT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `condition_status` enum('operational','maintenance_required','retired') DEFAULT 'operational',
  `is_checked_out` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `asset_tag`, `name`, `category`, `serial_number`, `condition_status`, `is_checked_out`, `created_at`, `updated_at`) VALUES
(1, 'CAM-SONY-A7M4-01', 'Sony Alpha 7 IV Full-Frame Mirrorless', 'Camera Body', 'SN-84920194', 'operational', 0, '2026-09-03 08:00:30', '2026-09-03 08:03:01'),
(2, 'CAM-SONY-FX3-01', 'Sony FX3 Cinema Line Full-Frame Camera', 'Camera Body', 'SN-39201844', 'operational', 0, '2026-09-03 08:00:30', '2026-09-03 08:00:30'),
(3, 'LNS-GM-2470-01', 'Sony FE 24-70mm f/2.8 GM II Lens', 'Lens', 'SN-77291033', 'operational', 0, '2026-09-03 08:00:30', '2026-09-03 08:00:30'),
(4, 'LNS-GM-70200-01', 'Sony FE 70-200mm f/2.8 GM OSS II', 'Lens', 'SN-61029341', 'operational', 0, '2026-09-03 08:00:30', '2026-09-03 08:00:30'),
(5, 'DRN-DJI-AIR3-01', 'DJI Air 3 Drone with Fly More Combo', 'Drone', 'SN-10928475', 'operational', 0, '2026-09-03 08:00:30', '2026-09-03 08:00:30'),
(6, 'LGT-GODOX-AD600', 'Godox AD600Pro Outdoor Strobe Light', 'Lighting', 'SN-55291024', 'operational', 0, '2026-09-03 08:00:30', '2026-09-03 08:00:30');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_transactions`
--

CREATE TABLE `equipment_transactions` (
  `id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `session_id` int(11) DEFAULT NULL,
  `issued_to_user_id` int(11) NOT NULL,
  `checkout_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `checkin_time` timestamp NULL DEFAULT NULL,
  `condition_on_checkout` varchar(255) DEFAULT 'Good condition',
  `condition_on_checkin` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipment_transactions`
--

INSERT INTO `equipment_transactions` (`id`, `equipment_id`, `session_id`, `issued_to_user_id`, `checkout_time`, `checkin_time`, `condition_on_checkout`, `condition_on_checkin`) VALUES
(1, 1, 1, 4, '2026-09-03 08:02:57', '2026-09-03 08:03:01', 'Clean lens and full battery', 'Good condition, cleaned');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `expense_date` date NOT NULL,
  `recorded_by_user_id` int(11) DEFAULT NULL,
  `receipt_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `category`, `description`, `amount`, `expense_date`, `recorded_by_user_id`, `receipt_url`, `created_at`) VALUES
(1, 'Equipment Maintenance', 'Sensor cleaning & lens calibration for Sony A7 IV', 2500.00, '2026-08-15', 1, NULL, '2026-09-03 07:51:23'),
(2, 'Studio Operations', 'High-speed fiber internet subscription for gallery CDN uploads', 1499.00, '2026-08-20', 1, NULL, '2026-09-03 07:51:23'),
(3, 'Freelance Crew Payments', 'taxi', 1500.00, '2026-09-03', 1, NULL, '2026-09-03 07:54:46');

-- --------------------------------------------------------

--
-- Table structure for table `follow_ups`
--

CREATE TABLE `follow_ups` (
  `id` int(11) NOT NULL,
  `enquiry_id` int(11) NOT NULL,
  `assigned_to_user_id` int(11) DEFAULT NULL,
  `scheduled_date` date NOT NULL,
  `notes` text NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE `galleries` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `access_token` varchar(64) NOT NULL,
  `is_public` tinyint(1) DEFAULT 1,
  `status` enum('drafting','active','archived') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `galleries`
--

INSERT INTO `galleries` (`id`, `booking_id`, `title`, `access_token`, `is_public`, `status`, `created_at`) VALUES
(1, 2, 'darvins wedding', '602e201302ec9869b6cde1ed5040be802d46b00f99696b3a7565480a28df0be1', 1, 'active', '2026-09-02 18:45:16'),
(2, 3, 'jbkj', 'ee04b9a299e1a1d8bdcb00e874fae128790db83922c14e5af502e5fec48bef57', 1, 'active', '2026-09-03 10:25:25');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `balance_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `due_date` date NOT NULL,
  `status` enum('unpaid','partial','paid','void') DEFAULT 'unpaid',
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_number`, `booking_id`, `total_amount`, `paid_amount`, `balance_amount`, `due_date`, `status`, `issued_at`) VALUES
(1, 'INV-103829', 2, 57000.00, 1000.00, 56000.00, '2026-09-10', 'partial', '2026-09-03 07:55:03');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','warning','success','critical') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `action_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `action_link`, `created_at`) VALUES
(1, 1, 'New Booking Confirmed', 'Booking #BK-844328 has progressed to confirmed status.', 'success', 1, '/bookings', '2026-09-03 08:05:22'),
(2, 1, 'Urgent Editing Task Queued', 'Task \"wedding videos\" requires retoucher attention.', 'warning', 0, '/editing', '2026-09-03 08:05:22'),
(3, 1, 'Advance Payment Collected', 'Received ₹20,000 via UPI receipt #REC-202601.', 'info', 0, '/finance', '2026-09-03 08:05:22');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `package_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `name`, `code`, `description`, `package_price`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Royal Wedding Complete Bundle', 'PKG-ROYAL-WED', 'Includes Candid Photo, Traditional Video, Drone, and Luxury Album', 52000.00, 1, '2026-09-02 17:59:30', '2026-09-02 17:59:30');

-- --------------------------------------------------------

--
-- Table structure for table `package_items`
--

CREATE TABLE `package_items` (
  `id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `package_items`
--

INSERT INTO `package_items` (`id`, `package_id`, `service_id`, `quantity`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 1, 3, 1),
(4, 1, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `payment_number` varchar(50) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_type` enum('advance','balance','full') DEFAULT 'advance',
  `payment_method` enum('cash','upi','bank_transfer','card') DEFAULT 'cash',
  `transaction_reference` varchar(100) DEFAULT NULL,
  `status` enum('pending','successful','failed','refunded') DEFAULT 'successful',
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `received_by_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `payment_number`, `booking_id`, `amount`, `payment_type`, `payment_method`, `transaction_reference`, `status`, `paid_at`, `received_by_user_id`) VALUES
(1, 'REC-103824', 2, 1000.00, 'advance', 'cash', NULL, 'successful', '2026-09-03 07:55:03', 1);

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `gallery_id` int(11) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `storage_url` text NOT NULL,
  `thumbnail_url` text DEFAULT NULL,
  `is_cover` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `gallery_id`, `original_filename`, `storage_url`, `thumbnail_url`, `is_cover`, `created_at`) VALUES
(1, 1, 'Photo-7534.jpg', 'data:image/jpeg;base64,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', 'data:image/jpeg;base64,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', 1, '2026-09-02 18:47:07'),
(2, 1, 'Photo-1201.jpg', 'data:image/jpeg;base64,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', 'data:image/jpeg;base64,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', 0, '2026-09-02 18:48:21'),
(3, 2, 'RET-3061-1.jpg', 'https://t3.ftcdn.net/jpg/05/37/52/40/360_F_537524050_xvEYOY02lyRBAAYwVHaMy5b7fwpHFPoQ.jpg', 'https://t3.ftcdn.net/jpg/05/37/52/40/360_F_537524050_xvEYOY02lyRBAAYwVHaMy5b7fwpHFPoQ.jpg', 1, '2026-09-03 10:26:53');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Admin', 'Full administrative authority over studio system', '2026-09-02 17:33:43'),
(2, 'Manager', 'Manages daily bookings, staff assignment, and finances', '2026-09-02 17:33:43'),
(3, 'Photographer', 'Executes scheduled shoots and updates status', '2026-09-02 17:33:43'),
(4, 'Editor', 'Post-production processing and QC reviews', '2026-09-02 17:33:43'),
(5, 'Customer', 'Customer profile and gallery viewer', '2026-09-02 17:33:43');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration_minutes` int(11) DEFAULT 60,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `code`, `description`, `base_price`, `duration_minutes`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Candid Wedding Photography', 'SRV-WED-CND', 'High-end candid photo coverage by senior photographer', 25000.00, 360, 1, '2026-09-02 17:59:30', '2026-09-02 18:06:41'),
(2, 'Traditional Video Recording', 'SRV-VID-TRD', 'Full HD 1080p traditional event recording with lights', 15000.00, 360, 1, '2026-09-02 17:59:30', '2026-09-02 17:59:30'),
(3, 'Drone Aerial Cinematography', 'SRV-DRONE-4K', '4K aerial shoot with licensed drone pilot', 12000.00, 180, 1, '2026-09-02 17:59:30', '2026-09-02 17:59:30'),
(4, 'Studio Portrait Session', 'SRV-PORT-STD', 'Indoor studio portrait with backdrop and lighting setup', 5000.00, 90, 1, '2026-09-02 17:59:30', '2026-09-02 17:59:30'),
(5, 'Premium Leather Album (40 Pages)', 'SRV-ALBUM-PREM', 'Handmade velvet/leather bound 12x36 photobook', 8500.00, 0, 1, '2026-09-02 17:59:30', '2026-09-02 17:59:30'),
(6, 'imgs', 'SRV-18583', 'need this scecure', 900.00, 60, 1, '2026-09-02 18:05:18', '2026-09-02 18:05:18');

-- --------------------------------------------------------

--
-- Table structure for table `session_staff`
--

CREATE TABLE `session_staff` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_in_shoot` varchar(50) DEFAULT 'Lead Photographer',
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `session_staff`
--

INSERT INTO `session_staff` (`id`, `session_id`, `user_id`, `role_in_shoot`, `assigned_at`) VALUES
(1, 1, 3, 'Lead Photographer', '2026-09-02 18:28:45');

-- --------------------------------------------------------

--
-- Table structure for table `shoot_sessions`
--

CREATE TABLE `shoot_sessions` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `session_code` varchar(50) NOT NULL,
  `scheduled_start` datetime NOT NULL,
  `scheduled_end` datetime NOT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `session_status` enum('scheduled','in_progress','completed','postponed','cancelled') DEFAULT 'scheduled',
  `completion_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shoot_sessions`
--

INSERT INTO `shoot_sessions` (`id`, `booking_id`, `session_code`, `scheduled_start`, `scheduled_end`, `venue`, `session_status`, `completion_notes`, `created_at`) VALUES
(1, 2, 'SHT-725658', '2026-09-03 11:28:00', '2026-09-06 11:28:00', 'Studio Main Stage', 'completed', NULL, '2026-09-02 18:28:45');

-- --------------------------------------------------------

--
-- Table structure for table `staff_profiles`
--

CREATE TABLE `staff_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `designation` varchar(100) DEFAULT 'Staff Member',
  `skills` text DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `joined_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_profiles`
--

INSERT INTO `staff_profiles` (`id`, `user_id`, `designation`, `skills`, `is_available`, `joined_date`) VALUES
(1, 3, 'Senior Photographer', 'Candid, Traditional, Drone Operations', 1, NULL),
(2, 4, 'Colorist & Lead Retoucher', 'Photoshop, Lightroom, DaVinci Resolve', 1, NULL),
(4, 5, 'Staff Photographer', 'gimble', 1, NULL),
(5, 6, 'Staff Photographer', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'admin@rajastudio.com', '$2b$10$mtLlB65kdu/JdfNWeXopXOSf69wax3xLbJwjC6VD5cY1XgPegmQQy', 'Super', 'Admin', '+91 9876543210', 'active', '2026-09-02 17:33:43', '2026-09-02 17:41:35'),
(2, 2, 'manager@rajastudio.com', '$2a$10$T8Z.xXmP1Z8uF5pP0kI9h.O6e0R/l3L8cRqvO7g3eZ2zSg1K9.V8q', 'Ramesh', 'Kumar', '+91 9876543211', 'active', '2026-09-02 17:33:43', '2026-09-03 09:43:53'),
(3, 3, 'photo@rajastudio.com', '$2a$10$pY4rUGFdQswIDoTeWemp/.WcHMFnyAXnptvMFmtthCs3VguYMaM/O', 'Arun', 'Photographer', '+91 9876543212', 'active', '2026-09-02 17:33:43', '2026-09-03 10:08:41'),
(4, 4, 'editor@rajastudio.com', '$2b$10$Xn0oLcRwiA1WTAUAs9I2ouYCy3jfV6MUt1SW9kFNCuN7KkpY/QCcq', 'Karthik', 'Editor', '+91 9876543213', 'active', '2026-09-02 18:36:09', '2026-09-02 18:36:46'),
(5, 5, 'darvin@gmail.com', '$2a$10$u6Me1EoHlrpqepmUgw751uMm6F24iT5C/vdlDg4yvniu1uyu4fYdW', 'alphonse', 'niccori', '+919092038096', 'active', '2026-09-03 09:42:37', '2026-09-03 09:52:29'),
(6, 5, 'lini@gmail.com', '$2a$10$T8Z.xXmP1Z8uF5pP0kI9h.O6e0R/l3L8cRqvO7g3eZ2zSg1K9.V8q', 'alphonse', 'niccori', '+919092038096', 'active', '2026-09-03 09:44:17', '2026-09-03 09:45:29'),
(7, 5, 'kannan@gmail.com', '$2a$10$MAyDNh6xbGD2x/HFZ9Nce.rMCiVc8u9kc.6SH4krC0W1854yikk7.', 'kannan', 'kannan', '9342803223', 'inactive', '2026-09-03 11:25:56', '2026-09-03 11:27:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_entity` (`entity_name`,`entity_id`),
  ADD KEY `fk_audit_user` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_number` (`booking_number`),
  ADD KEY `fk_bookings_customer` (`customer_id`);

--
-- Indexes for table `booking_items`
--
ALTER TABLE `booking_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_booking_items_booking` (`booking_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customers_phone` (`phone`);

--
-- Indexes for table `editing_deliverables`
--
ALTER TABLE `editing_deliverables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_deliv_booking` (`booking_id`),
  ADD KEY `idx_deliv_customer` (`customer_id`);

--
-- Indexes for table `editing_tasks`
--
ALTER TABLE `editing_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_editing_status` (`status`),
  ADD KEY `fk_editing_session` (`session_id`),
  ADD KEY `fk_editing_editor` (`assigned_editor_id`);

--
-- Indexes for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_enquiries_status` (`status`),
  ADD KEY `fk_enquiries_customer` (`customer_id`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asset_tag` (`asset_tag`),
  ADD KEY `idx_equipment_status` (`condition_status`,`is_checked_out`);

--
-- Indexes for table `equipment_transactions`
--
ALTER TABLE `equipment_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eqtrans_equipment` (`equipment_id`),
  ADD KEY `fk_eqtrans_session` (`session_id`),
  ADD KEY `fk_eqtrans_user` (`issued_to_user_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_expenses_user` (`recorded_by_user_id`);

--
-- Indexes for table `follow_ups`
--
ALTER TABLE `follow_ups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_followups_enquiry` (`enquiry_id`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `access_token` (`access_token`),
  ADD KEY `fk_galleries_booking` (`booking_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `fk_invoices_booking` (`booking_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notif_user` (`user_id`,`is_read`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `package_items`
--
ALTER TABLE `package_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pkg_items_pkg` (`package_id`),
  ADD KEY `fk_pkg_items_srv` (`service_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_number` (`payment_number`),
  ADD KEY `fk_payments_booking` (`booking_id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_photos_gallery` (`gallery_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `session_staff`
--
ALTER TABLE `session_staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_session_user` (`session_id`,`user_id`),
  ADD KEY `fk_session_staff_user` (`user_id`);

--
-- Indexes for table `shoot_sessions`
--
ALTER TABLE `shoot_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_code` (`session_code`),
  ADD KEY `fk_shoots_booking` (`booking_id`);

--
-- Indexes for table `staff_profiles`
--
ALTER TABLE `staff_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `booking_items`
--
ALTER TABLE `booking_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `editing_deliverables`
--
ALTER TABLE `editing_deliverables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `editing_tasks`
--
ALTER TABLE `editing_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `equipment_transactions`
--
ALTER TABLE `equipment_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `follow_ups`
--
ALTER TABLE `follow_ups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `package_items`
--
ALTER TABLE `package_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `session_staff`
--
ALTER TABLE `session_staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shoot_sessions`
--
ALTER TABLE `shoot_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staff_profiles`
--
ALTER TABLE `staff_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `booking_items`
--
ALTER TABLE `booking_items`
  ADD CONSTRAINT `fk_booking_items_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `editing_deliverables`
--
ALTER TABLE `editing_deliverables`
  ADD CONSTRAINT `fk_deliv_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_deliv_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `editing_tasks`
--
ALTER TABLE `editing_tasks`
  ADD CONSTRAINT `fk_editing_editor` FOREIGN KEY (`assigned_editor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_editing_session` FOREIGN KEY (`session_id`) REFERENCES `shoot_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD CONSTRAINT `fk_enquiries_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `equipment_transactions`
--
ALTER TABLE `equipment_transactions`
  ADD CONSTRAINT `fk_eqtrans_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_eqtrans_session` FOREIGN KEY (`session_id`) REFERENCES `shoot_sessions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_eqtrans_user` FOREIGN KEY (`issued_to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `fk_expenses_user` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `follow_ups`
--
ALTER TABLE `follow_ups`
  ADD CONSTRAINT `fk_followups_enquiry` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `galleries`
--
ALTER TABLE `galleries`
  ADD CONSTRAINT `fk_galleries_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_invoices_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `package_items`
--
ALTER TABLE `package_items`
  ADD CONSTRAINT `fk_pkg_items_pkg` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pkg_items_srv` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `fk_photos_gallery` FOREIGN KEY (`gallery_id`) REFERENCES `galleries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `session_staff`
--
ALTER TABLE `session_staff`
  ADD CONSTRAINT `fk_session_staff_session` FOREIGN KEY (`session_id`) REFERENCES `shoot_sessions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_session_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shoot_sessions`
--
ALTER TABLE `shoot_sessions`
  ADD CONSTRAINT `fk_shoots_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_profiles`
--
ALTER TABLE `staff_profiles`
  ADD CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
