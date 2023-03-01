USE team6o;

CREATE TABLE IF NOT EXISTS accounts
(
    uid int auto_increment,
    name varchar(100) not null,
    email varchar(100) not null,
    password varchar(100) not null,
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
