-- MySQL dump 10.13  Distrib 8.0.17, for macos10.14 (x86_64)
--
-- Host: localhost    Database: crosswalk
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS Crosswalk;
use Crosswalk;
--
-- Table structure for table `coordinates`
--

DROP TABLE IF EXISTS `coordinates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordinates` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordinates`
--

LOCK TABLES `coordinates` WRITE;
/*!40000 ALTER TABLE `coordinates` DISABLE KEYS */;
INSERT INTO `coordinates` VALUES (55,12,10),(56,22,20),(57,12,10),(58,22,20),(59,41.56042633772714,-8.406037688255308),(60,41.56041028188292,-8.405965268611908),(61,NULL,NULL),(62,NULL,NULL),(63,10,11),(64,12,13),(65,41.467412233615725,-8.489127159118652),(66,41.46744439146881,-8.489298820495605),(67,20,-10),(68,22,-12);
/*!40000 ALTER TABLE `coordinates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crosswalk`
--

DROP TABLE IF EXISTS `crosswalk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crosswalk` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `state` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'Safe to pass',
  `cars` int(11) DEFAULT '0',
  `pedestrians` int(11) DEFAULT '0',
  `coordinates_oid` int(11) DEFAULT NULL,
  `coordinates_oid_2` int(11) DEFAULT NULL,
  PRIMARY KEY (`oid`),
  KEY `fk_crosswalk_coordinates_2` (`coordinates_oid`),
  KEY `fk_crosswalk_coordinates` (`coordinates_oid_2`),
  CONSTRAINT `fk_crosswalk_coordinates` FOREIGN KEY (`coordinates_oid_2`) REFERENCES `coordinates` (`oid`),
  CONSTRAINT `fk_crosswalk_coordinates_2` FOREIGN KEY (`coordinates_oid`) REFERENCES `coordinates` (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crosswalk`
--

LOCK TABLES `crosswalk` WRITE;
/*!40000 ALTER TABLE `crosswalk` DISABLE KEYS */;
INSERT INTO `crosswalk` VALUES (13,'Safe to pass',0,0,59,60),(14,'Safe to pass',0,0,63,64),(15,'Safe to pass',0,0,65,66),(16,'Safe to pass',0,0,67,68);
/*!40000 ALTER TABLE `crosswalk` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-02 14:15:21
