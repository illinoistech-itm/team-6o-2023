USE team6o;

CREATE TABLE `accounts` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `token` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`uid`)
);

CREATE TABLE `posts` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `caption` varchar(250) NOT NULL,
  `uid` int(11) NOT NULL,
  `created` varchar(250) NOT NULL,
  `edited` tinyint(4) NOT NULL DEFAULT 0,
  `updated` varchar(250) NOT NULL DEFAULT '0',
  `image` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`pid`),
  KEY `uid_idx_posts` (`uid`),
  CONSTRAINT `uid` FOREIGN KEY (`uid`) REFERENCES `accounts` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `comments` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `comment` varchar(250) NOT NULL,
  `date` varchar(250) NOT NULL,
  `uid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  PRIMARY KEY (`cid`),
  KEY `uid_idx` (`uid`),
  KEY `pid_idx` (`pid`),
  CONSTRAINT `pid_comments` FOREIGN KEY (`pid`) REFERENCES `posts` (`pid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `uid_comments` FOREIGN KEY (`uid`) REFERENCES `accounts` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
);
