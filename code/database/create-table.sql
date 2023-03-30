USE team6o;

CREATE TABLE IF NOT EXISTS accounts
(
    uid int AUTO_INCREMENT,
    first_name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
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

CREATE TABLE IF NOT EXISTS posts
(
  pid int AUTO_INCREMENT,
  caption varchar(250),
  date varchar(250),
  email varchar(100),
  primary key(pid),
    constraint fk_email
    foreign key(email)
      references accounts(email)
);

CREATE TABLE IF NOT EXISTS comments
(
  cid int AUTO_INCREMENT,
  comment varchar(250),
  pid int,
  primary key(cid),
    constraint fk_pid
    foreign key(pid)
      references posts(pid)
);
