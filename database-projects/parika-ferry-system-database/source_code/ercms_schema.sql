-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.43 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.12.0.7122
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ercms
DROP DATABASE IF EXISTS `ercms`;
CREATE DATABASE IF NOT EXISTS `ercms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ercms`;

-- Dumping structure for table ercms.booking
DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `person_id` int NOT NULL,
  `schedule_id` int NOT NULL,
  `booking_datetime` datetime NOT NULL,
  `trip_type` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `person_id` (`person_id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `passenger` (`person_id`),
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`schedule_id`),
  CONSTRAINT `booking_chk_1` CHECK ((`trip_type` in (_utf8mb4'one_way',_utf8mb4'round_trip'))),
  CONSTRAINT `booking_chk_2` CHECK ((`status` in (_utf8mb4'confirmed',_utf8mb4'cancelled',_utf8mb4'expired')))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.booking: ~15 rows (approximately)
INSERT INTO `booking` (`booking_id`, `person_id`, `schedule_id`, `booking_datetime`, `trip_type`, `status`) VALUES
	(1, 1, 1, '2025-12-20 08:00:00', 'one_way', 'cancelled'),
	(2, 2, 1, '2025-12-26 11:00:00', 'round_trip', 'confirmed'),
	(3, 3, 1, '2025-12-20 08:00:00', 'one_way', 'cancelled'),
	(4, 4, 2, '2025-12-26 11:00:00', 'one_way', 'confirmed'),
	(5, 5, 2, '2025-02-14 06:26:25', 'one_way', 'expired'),
	(6, 6, 2, '2025-12-26 11:00:00', 'round_trip', 'confirmed'),
	(7, 7, 3, '2025-12-20 08:00:00', 'one_way', 'cancelled'),
	(8, 8, 3, '2025-12-26 11:00:00', 'one_way', 'confirmed'),
	(9, 9, 3, '2025-12-26 11:00:00', 'round_trip', 'confirmed'),
	(10, 10, 1, '2025-12-26 11:00:00', 'round_trip', 'confirmed'),
	(11, 11, 2, '2025-12-20 08:00:00', 'one_way', 'cancelled'),
	(12, 12, 3, '2025-12-26 11:00:00', 'one_way', 'confirmed'),
	(13, 13, 1, '2025-12-26 11:00:00', 'round_trip', 'confirmed'),
	(14, 14, 2, '2025-12-20 08:00:00', 'one_way', 'cancelled'),
	(15, 15, 3, '2025-09-24 11:46:25', 'round_trip', 'expired');

-- Dumping structure for table ercms.crew
DROP TABLE IF EXISTS `crew`;
CREATE TABLE IF NOT EXISTS `crew` (
  `person_id` int NOT NULL,
  `crew_rank` varchar(30) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  PRIMARY KEY (`person_id`),
  CONSTRAINT `crew_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE,
  CONSTRAINT `crew_chk_1` CHECK ((`crew_rank` in (_utf8mb4'captain',_utf8mb4'first_officer',_utf8mb4'engineer',_utf8mb4'deckhand')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.crew: ~5 rows (approximately)
INSERT INTO `crew` (`person_id`, `crew_rank`, `salary`) VALUES
	(16, 'captain', 350000.00),
	(17, 'first_officer', 280000.00),
	(18, 'engineer', 260000.00),
	(19, 'deckhand', 180000.00),
	(20, 'deckhand', 180000.00);

-- Dumping structure for table ercms.crew_assignment
DROP TABLE IF EXISTS `crew_assignment`;
CREATE TABLE IF NOT EXISTS `crew_assignment` (
  `schedule_id` int NOT NULL,
  `crew_person_id` int NOT NULL,
  `role_on_trip` varchar(30) NOT NULL,
  PRIMARY KEY (`schedule_id`,`crew_person_id`),
  KEY `crew_person_id` (`crew_person_id`),
  CONSTRAINT `crew_assignment_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`schedule_id`),
  CONSTRAINT `crew_assignment_ibfk_2` FOREIGN KEY (`crew_person_id`) REFERENCES `crew` (`person_id`),
  CONSTRAINT `crew_assignment_chk_1` CHECK ((`role_on_trip` in (_utf8mb4'captain',_utf8mb4'navigator',_utf8mb4'engineer',_utf8mb4'loader')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.crew_assignment: ~7 rows (approximately)
INSERT INTO `crew_assignment` (`schedule_id`, `crew_person_id`, `role_on_trip`) VALUES
	(1, 16, 'captain'),
	(1, 17, 'navigator'),
	(1, 18, 'engineer'),
	(2, 16, 'captain'),
	(2, 19, 'loader'),
	(3, 16, 'captain'),
	(3, 20, 'loader');

-- Dumping structure for table ercms.passenger
DROP TABLE IF EXISTS `passenger`;
CREATE TABLE IF NOT EXISTS `passenger` (
  `person_id` int NOT NULL,
  `id_number` varchar(50) NOT NULL,
  PRIMARY KEY (`person_id`),
  UNIQUE KEY `id_number` (`id_number`),
  CONSTRAINT `passenger_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.passenger: ~15 rows (approximately)
INSERT INTO `passenger` (`person_id`, `id_number`) VALUES
	(1, 'GY-PASS-001'),
	(2, 'GY-PASS-002'),
	(3, 'GY-PASS-003'),
	(4, 'GY-PASS-004'),
	(5, 'GY-PASS-005'),
	(6, 'GY-PASS-006'),
	(7, 'GY-PASS-007'),
	(8, 'GY-PASS-008'),
	(9, 'GY-PASS-009'),
	(10, 'GY-PASS-010'),
	(11, 'GY-PASS-011'),
	(12, 'GY-PASS-012'),
	(13, 'GY-PASS-013'),
	(14, 'GY-PASS-014'),
	(15, 'GY-PASS-015');

-- Dumping structure for table ercms.person
DROP TABLE IF EXISTS `person`;
CREATE TABLE IF NOT EXISTS `person` (
  `person_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  PRIMARY KEY (`person_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.person: ~20 rows (approximately)
INSERT INTO `person` (`person_id`, `first_name`, `last_name`, `phone`, `email`, `date_of_birth`) VALUES
	(1, 'Alicia', 'Williams', '592-6101234', 'alicia.williams2189@gmail.com', '2001-03-14'),
	(2, 'Brian', 'Singh', '592-6223344', 'brian.singh456@yahoo.com', '1994-07-22'),
	(3, 'Vimla', 'Persaud', '592-6158899', 'vpersaud12@outlook.com', '2002-11-30'),
	(4, 'Marcia', 'Thomas', '592-6094411', 'marthommy@yahoo.com', '1992-01-05'),
	(5, 'Samuel', 'Joseph', '592-6209988', 'samuel.joseph@gmail.com', '1980-02-10'),
	(6, 'Daniel', 'Persaud', '592-6275544', 'danielpersaud11@outlook.com', '2002-09-09'),
	(7, 'Kavita', 'Ramnarine', '592-7183322', 'kavita.ramnarine@gmail.com', '1997-12-21'),
	(8, 'Andre', 'Lewis', '592-6042211', 'andre.lewis@yahoo.com', '1990-04-03'),
	(9, 'Natasha', 'Mohamed', '592-6119988', 'natmohamed566@yahoo.com', '2008-08-27'),
	(10, 'Dwayne', 'Hinds', '592-6234455', 'itsyoboyyyy@outlook.com', '1983-10-15'),
	(11, 'Sharon', 'Grant', '592-7178899', 'sharon.grant@yahoo.com', '1978-05-06'),
	(12, 'Kevin', 'Bacchus', '592-6213344', 'kevinbacchus345@gmail.com', '2003-02-19'),
	(13, 'Ravindra', 'Persaud', '592-6127788', 'rpersaud1234@gmail.com', '1998-11-11'),
	(14, 'Rohan', 'Chand', '592-6254411', 'rohanqueen12@outlook.com', '1986-01-29'),
	(15, 'Melissa', 'Forde', '592-6086633', 'melissa.forde@yahoo.com', '2016-07-17'),
	(16, 'Jason', 'Bowman', '592-7795522', 'jason.bowman@outlook.com', '1989-03-08'),
	(17, 'Anika', 'Sutherland', '592-6069988', 'anika.sutherland@gmail.com', '2000-09-25'),
	(18, 'Tiana', 'Douglas', '592-6142200', 'tiana.douglas@yahoo.com', '2001-04-30'),
	(19, 'Kaylee', 'Carter', '592-6137766', 'kayleecarter844@gmail.com', '1999-06-18'),
	(20, 'Tulsidai', 'Singh', '592-7243311', 'tulsisingh12@outlook.com', '1975-12-02');

-- Dumping structure for table ercms.route
DROP TABLE IF EXISTS `route`;
CREATE TABLE IF NOT EXISTS `route` (
  `route_id` int NOT NULL AUTO_INCREMENT,
  `origin_terminal_id` int NOT NULL,
  `destination_terminal_id` int NOT NULL,
  `distance_km` decimal(6,2) DEFAULT NULL,
  `base_passenger_fare` decimal(8,2) NOT NULL,
  PRIMARY KEY (`route_id`),
  KEY `origin_terminal_id` (`origin_terminal_id`),
  KEY `destination_terminal_id` (`destination_terminal_id`),
  CONSTRAINT `route_ibfk_1` FOREIGN KEY (`origin_terminal_id`) REFERENCES `terminal` (`terminal_id`),
  CONSTRAINT `route_ibfk_2` FOREIGN KEY (`destination_terminal_id`) REFERENCES `terminal` (`terminal_id`),
  CONSTRAINT `route_chk_1` CHECK ((`origin_terminal_id` <> `destination_terminal_id`))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.route: ~2 rows (approximately)
INSERT INTO `route` (`route_id`, `origin_terminal_id`, `destination_terminal_id`, `distance_km`, `base_passenger_fare`) VALUES
	(1, 1, 2, 18.50, 100.00),
	(2, 2, 1, 18.50, 100.00);

-- Dumping structure for table ercms.schedule
DROP TABLE IF EXISTS `schedule`;
CREATE TABLE IF NOT EXISTS `schedule` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `route_id` int NOT NULL,
  `vessel_id` int NOT NULL,
  `departure_datetime` datetime NOT NULL,
  `arrival_datetime` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `route_id` (`route_id`),
  KEY `vessel_id` (`vessel_id`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`),
  CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`vessel_id`) REFERENCES `vessel` (`vessel_id`),
  CONSTRAINT `schedule_chk_1` CHECK ((`status` in (_utf8mb4'scheduled',_utf8mb4'departed',_utf8mb4'completed',_utf8mb4'cancelled')))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.schedule: ~4 rows (approximately)
INSERT INTO `schedule` (`schedule_id`, `route_id`, `vessel_id`, `departure_datetime`, `arrival_datetime`, `status`) VALUES
	(1, 1, 1, '2025-12-23 07:00:00', '2025-12-23 08:30:00', 'scheduled'),
	(2, 1, 2, '2025-12-23 10:00:00', '2025-12-23 11:30:00', 'scheduled'),
	(3, 2, 1, '2025-12-23 14:00:00', '2025-12-23 15:30:00', 'scheduled'),
	(4, 2, 3, '2025-12-23 17:00:00', '2025-12-23 18:30:00', 'cancelled');

-- Dumping structure for table ercms.terminal
DROP TABLE IF EXISTS `terminal`;
CREATE TABLE IF NOT EXISTS `terminal` (
  `terminal_id` int NOT NULL AUTO_INCREMENT,
  `terminal_name` varchar(100) NOT NULL,
  `location_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`terminal_id`),
  UNIQUE KEY `terminal_name` (`terminal_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.terminal: ~3 rows (approximately)
INSERT INTO `terminal` (`terminal_id`, `terminal_name`, `location_description`) VALUES
	(1, 'Parika Stelling', 'Parika, East Bank Essequibo, Guyana'),
	(2, 'Leguan Stelling', 'Leguan Island, Essequibo River, Guyana'),
	(3, 'Supenaam Stelling', 'Supenaam, Essequibo Coast, Guyana');

-- Dumping structure for table ercms.ticket
DROP TABLE IF EXISTS `ticket`;
CREATE TABLE IF NOT EXISTS `ticket` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `passenger_category` varchar(20) NOT NULL,
  `passenger_fare_amount` decimal(8,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`),
  CONSTRAINT `ticket_chk_1` CHECK ((`passenger_category` in (_utf8mb4'adult',_utf8mb4'child',_utf8mb4'student',_utf8mb4'senior',_utf8mb4'infant'))),
  CONSTRAINT `ticket_chk_2` CHECK ((`status` in (_utf8mb4'active',_utf8mb4'cancelled',_utf8mb4'refunded')))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.ticket: ~15 rows (approximately)
INSERT INTO `ticket` (`ticket_id`, `booking_id`, `passenger_category`, `passenger_fare_amount`, `status`) VALUES
	(1, 1, 'adult', 380.00, 'cancelled'),
	(2, 2, 'adult', 380.00, 'active'),
	(3, 3, 'child', 200.00, 'cancelled'),
	(4, 4, 'adult', 380.00, 'active'),
	(5, 5, 'senior', 0.00, 'refunded'),
	(6, 6, 'adult', 380.00, 'active'),
	(7, 7, 'adult', 380.00, 'cancelled'),
	(8, 8, 'adult', 380.00, 'active'),
	(9, 9, 'child', 200.00, 'active'),
	(10, 10, 'adult', 380.00, 'active'),
	(11, 11, 'adult', 380.00, 'cancelled'),
	(12, 12, 'senior', 0.00, 'active'),
	(13, 13, 'adult', 380.00, 'active'),
	(14, 14, 'adult', 380.00, 'cancelled'),
	(15, 15, 'adult', 380.00, 'refunded');

-- Dumping structure for table ercms.vehicle
DROP TABLE IF EXISTS `vehicle`;
CREATE TABLE IF NOT EXISTS `vehicle` (
  `ticket_id` int NOT NULL,
  `vehicle_seq` int NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `plate_number` varchar(20) NOT NULL,
  `vehicle_fare_amount` decimal(8,2) NOT NULL,
  PRIMARY KEY (`ticket_id`,`vehicle_seq`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.vehicle: ~5 rows (approximately)
INSERT INTO `vehicle` (`ticket_id`, `vehicle_seq`, `vehicle_type`, `plate_number`, `vehicle_fare_amount`) VALUES
	(2, 1, 'Car', 'PAJ-1023', 8000.00),
	(5, 1, 'Motorcycle', 'PMO-3344', 3000.00),
	(7, 1, 'Truck', 'PTT-7788', 12000.00),
	(10, 1, 'Car', 'PAJ-5566', 8000.00),
	(14, 1, 'Car', 'PAJ-8899', 8000.00);

-- Dumping structure for table ercms.vessel
DROP TABLE IF EXISTS `vessel`;
CREATE TABLE IF NOT EXISTS `vessel` (
  `vessel_id` int NOT NULL AUTO_INCREMENT,
  `vessel_name` varchar(100) NOT NULL,
  `passenger_capacity` int NOT NULL,
  `vehicle_capacity` int NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`vessel_id`),
  UNIQUE KEY `vessel_name` (`vessel_name`),
  CONSTRAINT `vessel_chk_1` CHECK ((`status` in (_utf8mb4'active',_utf8mb4'maintenance',_utf8mb4'out_of_service')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table ercms.vessel: ~3 rows (approximately)
INSERT INTO `vessel` (`vessel_id`, `vessel_name`, `passenger_capacity`, `vehicle_capacity`, `status`) VALUES
	(1, 'MV Kanawan', 400, 40, 'active'),
	(2, 'MV Sabanto', 400, 40, 'active'),
	(3, 'MV Malali', 250, 15, 'active'),
	(4, 'MV Konawaruk 1899', 350, 25, 'active');

-- Dumping structure for trigger ercms.trg_booking_status_update_ticket
DROP TRIGGER IF EXISTS `trg_booking_status_update_ticket`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_booking_status_update_ticket` AFTER UPDATE ON `booking` FOR EACH ROW BEGIN
    -- If booking is cancelled, cancel all tickets
    IF NEW.status = 'cancelled' THEN
        UPDATE ticket SET status = 'cancelled' WHERE booking_id = NEW.booking_id;
    
    -- If booking expires, mark as 'void' or 'refunded' based on your policy
    ELSEIF NEW.status = 'expired' THEN
        UPDATE ticket SET status = 'cancelled' WHERE booking_id = NEW.booking_id;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;