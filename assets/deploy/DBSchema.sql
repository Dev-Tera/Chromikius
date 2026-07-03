--
-- Table structure for table `disabled_commands`
--

DROP TABLE IF EXISTS `disabled_commands`;
CREATE TABLE `disabled_commands` (
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `levelsystem`
--

DROP TABLE IF EXISTS `levelsystem`;
CREATE TABLE `levelsystem` (
  `memberId` varchar(20) NOT NULL,
  `xp` int(11) DEFAULT NULL,
  PRIMARY KEY (`memberId`),
  UNIQUE KEY `id` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `selfroles`
--

DROP TABLE IF EXISTS `selfroles`;
CREATE TABLE `selfroles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `emoji` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `roleId` varchar(20) DEFAULT NULL,
  `channelId` varchar(20) DEFAULT NULL,
  `messageId` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `warnsystem`
--

DROP TABLE IF EXISTS `warnsystem`;
CREATE TABLE `warnsystem` (
  `id` bigint(20) DEFAULT NULL,
  `warnlevel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
