
--
-- Table structure for table `core_acl_access_list`
--

CREATE TABLE IF NOT EXISTS `core_acl_access_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` varchar(32) NOT NULL,
  `resource_id` varchar(32) NOT NULL,
  `access_id` varchar(32) NOT NULL,
  `allowed` int(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_id` (`role_id`,`resource_id`,`access_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `core_acl_access_list`
--

INSERT INTO `core_acl_access_list` (`id`, `role_id`, `resource_id`, `access_id`, `allowed`) VALUES
  (1, '6', '1', '2', 1),
  (2, '5', '1', '3', 1),
  (3, '5', '1', '4', 1),
  (4, '5', '1', '5', 1),
  (5, '1', '1', '1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `core_acl_resource`
--

CREATE TABLE IF NOT EXISTS `core_acl_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `core_acl_resource`
--

INSERT INTO `core_acl_resource` (`id`, `name`, `description`) VALUES
  (1, 'admin_area', ''),
  (2, '*', '');

-- --------------------------------------------------------

--
-- Table structure for table `core_acl_resource_access`
--

CREATE TABLE IF NOT EXISTS `core_acl_resource_access` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resource_id` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_id` (`resource_id`,`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `core_acl_resource_access`
--

INSERT INTO `core_acl_resource_access` (`id`, `resource_id`, `name`) VALUES
  (1, '1', '*'),
  (3, '1', 'auth'),
  (4, '1', 'check'),
  (5, '1', 'isauth'),
  (2, '1', 'read');

-- --------------------------------------------------------

--
-- Table structure for table `core_acl_role`
--

CREATE TABLE IF NOT EXISTS `core_acl_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `core_acl_role`
--

INSERT INTO `core_acl_role` (`id`, `name`, `description`) VALUES
  (1, 'admin', ''),
  (2, 'guest', ''),
  (3, 'user', ''),
  (5, 'admin-auth', ''),
  (6, 'admin-read', ''),
  (7, 'test3', '');

-- --------------------------------------------------------

--
-- Table structure for table `core_acl_role_inherit`
--

CREATE TABLE IF NOT EXISTS `core_acl_role_inherit` (
  `id` smallint(3) NOT NULL AUTO_INCREMENT,
  `role_id` smallint(3) NOT NULL,
  `inherit_role_id` smallint(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_id` (`role_id`,`inherit_role_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `core_menu_item`
--

CREATE TABLE IF NOT EXISTS `core_menu_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `controller_id` varchar(200) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `alias` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  `image` varchar(100) NOT NULL DEFAULT '',
  `position` int(11) NOT NULL DEFAULT '1',
  `status` enum('active','not_active') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Menu Items' AUTO_INCREMENT=16 ;

--
-- Dumping data for table `core_menu_item`
--

INSERT INTO `core_menu_item` (`id`, `menu_id`, `controller_id`, `parent_id`, `alias`, `title`, `description`, `image`, `position`, `status`) VALUES
  (1, 1, '-1', 0, '', 'Settings', 'Project settings', '', 1, 'active'),
  (2, 1, '-1', 1, '', 'User acccesses', '', '', 1, 'active'),
  (3, 1, '6', 2, '', 'Roles', '', '', 1, 'active'),
  (4, 1, '-1', 1, '', 'Menu', '', '', 3, 'active'),
  (5, 1, '-1', 1, '', 'Mvc', '', '', 2, 'active'),
  (7, 1, '2', 4, '', 'Items', '', '', 2, 'active'),
  (8, 1, '3', 5, '', 'Modules', '', '', 1, 'active'),
  (9, 1, '4', 5, '', 'Controllers', '', '', 2, 'active'),
  (10, 1, '5', 5, '', 'Actions', '', '', 3, 'active'),
  (11, 1, '1', 4, '', 'Menus', '', '', 1, 'active'),
  (12, 1, '7', 2, '', 'Accesses', '', '', 4, 'active'),
  (13, 1, '8', 2, '', 'Resources', '', '', 2, 'active'),
  (14, 1, '9', 2, '', 'Access list', '', '', 5, 'active'),
  (15, 1, '10', 2, '', 'Inherit of roles', '', '', 5, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `core_menu_menus`
--

CREATE TABLE IF NOT EXISTS `core_menu_menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Menu' AUTO_INCREMENT=2 ;

--
-- Dumping data for table `core_menu_menus`
--

INSERT INTO `core_menu_menus` (`id`, `name`) VALUES
  (1, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `core_mvc_action`
--

CREATE TABLE IF NOT EXISTS `core_mvc_action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `controller_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','not_active') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `controller_id` (`controller_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `core_mvc_controller`
--

CREATE TABLE IF NOT EXISTS `core_mvc_controller` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('active','not_active') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `core_mvc_controller`
--

INSERT INTO `core_mvc_controller` (`id`, `module_id`, `name`, `status`) VALUES
  (1, 2, 'menu-menus', 'active'),
  (2, 2, 'menu-item', 'active'),
  (3, 2, 'mvc-module', 'active'),
  (4, 2, 'mvc-controller', 'active'),
  (5, 2, 'mvc-action', 'active'),
  (6, 2, 'acl-role', 'active'),
  (7, 2, 'acl-access', 'active'),
  (8, 2, 'acl-resource', 'active'),
  (9, 2, 'acl-accessList', 'active'),
  (10, 2, 'acl-roleInherit', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `core_mvc_module`
--

CREATE TABLE IF NOT EXISTS `core_mvc_module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('active','not_active') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `core_mvc_module`
--

INSERT INTO `core_mvc_module` (`id`, `name`, `status`) VALUES
  (1, 'admin', 'active'),
  (2, 'extjs-cms', 'active'),
  (4, 'user', 'active');
