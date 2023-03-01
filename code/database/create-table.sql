USE team6o;

CREATE TABLE IF NOT EXISTS accounts 
(
  uid int(11) AUTO_INCREMENT PRIMARY KEY,
  name varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS images 
(
  imageid int(11) AUTO_INCREMENT PRIMARY KEY,
  imagesrc TEXT NOT NULL,
  caption varchar(180),
  uid int(11) FOREIGN KEY REFERENCES accounts(uid)
);