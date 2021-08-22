create database Sistema_Solar;

use Sistema_Solar;

create table Planetas (
	id int identity(1,1) primary key,
	nome varchar(20) not null,
	distancia_sol decimal,
	translacao varchar(15),
	rotacao varchar(15),
	diametro_equatorial int,
	temperatura_superficie varchar(15),
	densidade_media decimal,
	num_satelites_naturais int,
	foto varchar(100)
);


