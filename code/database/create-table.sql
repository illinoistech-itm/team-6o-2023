USE team6o;

CREATE TABLE IF NOT EXISTS accounts
(
    uid int AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    primary key(uid)
);

CREATE TABLE IF NOT EXISTS images
(
  imageid int AUTO_INCREMENT,
  imagesrc TEXT NOT NULL,
  caption varchar(180),
  uid int,
  primary key(imageid),
    constraint fk_type
    foreign key(uid) 
        references accounts(uid)
);
