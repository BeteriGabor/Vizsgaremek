CREATE DATABASE `20d_kerekesd_users_management`;
create table ourusers(
    id int not null auto_increment,
    username varchar(255) not null,
    password varchar(255) not null,
    birth_Date Date not null,
    email varchar(255) not null, 
    role varchar(255) not null,
    primary key(id)
);