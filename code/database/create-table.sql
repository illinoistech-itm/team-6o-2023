USE team6o;

CREATE TABLE IF NOT EXISTS accounts 
(
uid int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
name varchar(50) NOT NULL,
email varchar(100) NOT NULL,
password varchar(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS images 
(
uid int(11) NOT NULL FOREIGN KEY,
imageid NOT NULL AUTO_INCREMENT PRIMARY KEY,
imagesrc TEXT
caption varchar(180),
);