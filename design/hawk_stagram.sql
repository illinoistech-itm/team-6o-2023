CREATE TABLE `Tags` (
  `tag_id` <type>,
  `tag` <type>,
  PRIMARY KEY (`tag_id`)
);

CREATE TABLE `Comments` (
  `comment_id` <type>,
  `comment` <type>,
  `user_id` <type>,
  `photo_id` <type>,
  `comment_count` <type>,
  PRIMARY KEY (`comment_id`)
);

CREATE TABLE `Login` (
  `username` <type>,
  `password` <type>
);

CREATE TABLE `User` (
  `user_id` <type>,
  `username` <type>,
  `email` <type>,
  `password` <type>,
  `first_name` <type>,
  `last_name` <type>,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `Followers` (
  `follower_id` <type>,
  `user_name` <type>,
  `follower_count` <type>,
  PRIMARY KEY (`follower_id`),
  FOREIGN KEY (`user_name`) REFERENCES `User`(`username`)
);

CREATE TABLE `Following` (
  `following_id` <type>,
  `user_name` <type>,
  `following_count` <type>,
  PRIMARY KEY (`following_id`),
  FOREIGN KEY (`user_name`) REFERENCES `User`(`last_name`)
);

CREATE TABLE `Feed` (
  `feed_id` <type>,
  `username` <type>,
  `follower_count` <type>,
  `following_count` <type>,
  `post_id` <type>,
  PRIMARY KEY (`feed_id`),
  FOREIGN KEY (`following_count`) REFERENCES `Following`(`following_count`),
  FOREIGN KEY (`follower_count`) REFERENCES `Followers`(`follower_count`)
);

CREATE TABLE `Post` (
  `post_id` <type>,
  `caption` <type>,
  `username` <type>,
  `photo_id` <type>,
  `tags_id` <type>,
  `like_count` <type>,
  `comment_id` <type>,
  PRIMARY KEY (`post_id`),
  FOREIGN KEY (`username`) REFERENCES `User`(`username`),
  KEY `Fk` (`tags_id`)
);

CREATE TABLE `Likes` (
  `like_count` <type>,
  `user_id` <type>,
  `photo_id` <type>,
  PRIMARY KEY (`like_count`),
  FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`)
);

CREATE TABLE `Photo` (
  `photo_id` <type>,
  `user_id` <type>,
  `image` <type>,
  PRIMARY KEY (`photo_id`)
);

