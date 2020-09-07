CREATE DATABASE loseit;

CREATE TABLE Users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(20),
  password VARCHAR(20),
  current_weight DECIMAL(6,2),
  sex VARCHAR(10),
  height DECIMAL(3,2),
  age INTEGER,
  type VARCHAR(20),
  calories_day INTEGER,
  calories_week INTEGER,
  bmi DECIMAL(3,2),
  ideal_weight INTEGER,
  goal DECIMAL(6,2)
);

CREATE TABLE Weeks(
  week_id SERIAL PRIMARY KEY,
  week DATE,
  weight DECIMAL(5,2),
  delta DECIMAL(3,2),
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES Users (user_id)
);

INSERT INTO Users (username,password,current_weight,sex,height,age,type,calories_day,calories_week,bmi,ideal_weight,goal) VALUES ('Jaime','jaime',111.9,'male',1.75,55,'Light Exercise',null,null,null,null,null);
INSERT INTO Users (username,password,current_weight,sex,height,age,type,calories_day,calories_week,bmi,ideal_weight,goal) VALUES ('Narce','narce',83.6,'female',1.55,58,'Sedentary',null,null,null,null,null);
INSERT INTO Users (username,password,current_weight,sex,height,age,type,calories_day,calories_week,bmi,ideal_weight,goal) VALUES ('Karen','karen',62.1,'female',1.60,28,'Sedentary',null,null,null,null,null);
INSERT INTO Users (username,password,current_weight,sex,height,age,type,calories_day,calories_week,bmi,ideal_weight,goal) VALUES ('Carol','carol',61.6,'female',1.55,32,'Sedentary',null,null,null,null,null);

UPDATE Users SET current_weight = 62.7 WHERE user_id = 3;

INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-07-27',117.5,null,1);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-07-27',85.1,null,2);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-07-27',61.9,null,3);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-07-27',62.3,null,4);

INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-03',115.4,null,1);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-03',84.8,null,2);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-03',61.6,null,3);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-03',62.1,null,4);

INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-10',113.4,null,1);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-10',82.8,null,2);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-10',61.1,null,3);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-10',61.8,null,4);

INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-17',114.3,null,1);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-17',83.4,null,2);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-17',61.6,null,3);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-17',62.6,null,4);

INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-24',113.2,null,1);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-24',83.7,null,2);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-24',62.1,null,3);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-24',63.7,null,4);

INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-31',111.9,null,1);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-31',83.6,null,2);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-31',62.7,null,3);
INSERT INTO Weeks (week,weight,delta,user_id) VALUES ('2020-08-31',61.6,null,4);

SELECT Users.user_id,Users.username,Users.current_weight,Users.sex,Users.height,Users.age,Users.type,Weeks.week,Weeks.weight FROM Users INNER JOIN Weeks ON Users.user_id = Weeks.user_id WHERE Users.user_id=1;

ALTER TABLE Weeks
ADD previous_weight DECIMAL(5,2);

UPDATE Weeks SET previous_weight = null WHERE week_id = 1;
UPDATE Weeks SET previous_weight = null WHERE week_id = 2;
UPDATE Weeks SET previous_weight = null WHERE week_id = 3;
UPDATE Weeks SET previous_weight = null WHERE week_id = 4;

UPDATE Weeks SET previous_weight = 117.50 WHERE week_id = 5;
UPDATE Weeks SET previous_weight = 85.10 WHERE week_id = 6;
UPDATE Weeks SET previous_weight = 61.90 WHERE week_id = 7;
UPDATE Weeks SET previous_weight = 62.30 WHERE week_id = 8;

UPDATE Weeks SET previous_weight = 115.40 WHERE week_id = 9;
UPDATE Weeks SET previous_weight = 84.80 WHERE week_id = 10;
UPDATE Weeks SET previous_weight = 61.60 WHERE week_id = 11;
UPDATE Weeks SET previous_weight = 62.10 WHERE week_id = 12;

UPDATE Weeks SET previous_weight = 113.40 WHERE week_id = 13;
UPDATE Weeks SET previous_weight = 82.80 WHERE week_id = 14;
UPDATE Weeks SET previous_weight = 61.10 WHERE week_id = 15;
UPDATE Weeks SET previous_weight = 61.80 WHERE week_id = 16;

UPDATE Weeks SET previous_weight = 114.30 WHERE week_id = 17;
UPDATE Weeks SET previous_weight = 83.40 WHERE week_id = 18;
UPDATE Weeks SET previous_weight = 61.60 WHERE week_id = 19;
UPDATE Weeks SET previous_weight = 62.60 WHERE week_id = 20;

UPDATE Weeks SET previous_weight = 113.20 WHERE week_id = 21;
UPDATE Weeks SET previous_weight = 83.70 WHERE week_id = 22;
UPDATE Weeks SET previous_weight = 62.10 WHERE week_id = 23;
UPDATE Weeks SET previous_weight = 63.70 WHERE week_id = 24;

SELECT Weeks.week,Users.username,Weeks.weight,Weeks.previous_weight, (Weeks.previous_weight-Weeks.weight) as delta_weight FROM Users INNER JOIN Weeks ON Users.user_id = Weeks.user_id;

ALTER TABLE Weeks
ADD delta_acc DECIMAL(5,2);


UPDATE Weeks SET delta = 2.10, delta_acc = 2.10 WHERE week_id = 5;
UPDATE Weeks SET delta = 0.30, delta_acc = 0.30 WHERE week_id = 6;
UPDATE Weeks SET delta = 0.30, delta_acc = 0.30 WHERE week_id = 7;
UPDATE Weeks SET delta = 0.20, delta_acc = 0.20 WHERE week_id = 8;

UPDATE Weeks SET delta = 2.00, delta_acc = 4.10 WHERE week_id = 9;
UPDATE Weeks SET delta = 2.00, delta_acc = 2.30 WHERE week_id = 10;
UPDATE Weeks SET delta = 0.50, delta_acc = 0.80 WHERE week_id = 11;
UPDATE Weeks SET delta = 0.30, delta_acc = 0.50 WHERE week_id = 12;

UPDATE Weeks SET delta = -0.90, delta_acc = 3.20 WHERE week_id = 13;
UPDATE Weeks SET delta = -0.60, delta_acc = 1.70 WHERE week_id = 14;
UPDATE Weeks SET delta = -0.50, delta_acc = 0.30 WHERE week_id = 15;
UPDATE Weeks SET delta = -0.80, delta_acc = -0.30 WHERE week_id = 16;

UPDATE Weeks SET delta = 1.10, delta_acc = 4.30 WHERE week_id = 17;
UPDATE Weeks SET delta = -0.30, delta_acc = 1.40 WHERE week_id = 18;
UPDATE Weeks SET delta = -0.50, delta_acc = -0.20 WHERE week_id = 19;
UPDATE Weeks SET delta = -1.10, delta_acc = -1.40 WHERE week_id = 20;

UPDATE Weeks SET delta = 1.30, delta_acc = 5.60 WHERE week_id = 21;
UPDATE Weeks SET delta = 0.10, delta_acc = 1.50 WHERE week_id = 22;
UPDATE Weeks SET delta = -0.60, delta_acc = -0.80 WHERE week_id = 23;
UPDATE Weeks SET delta = 2.10, delta_acc = 0.70 WHERE week_id = 24;

SELECT Weeks.week,Users.username,Weeks.weight,Weeks.previous_weight, Weeks.delta, Weeks.delta_acc FROM Users INNER JOIN Weeks ON Users.user_id = Weeks.user_id;
