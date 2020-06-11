# Web Engineering - Crosswalks

Crosswalks is a simple Crosswalks Notification System, built for a Curricular Unit inserted on the plan of studies of MSc in Computer Engineering at University of Minho, with the focus of developing fully distributed Micro-services. This solution features several Microservices and even a simulator of Cars driving down the road and Pedestrians crossing the road.

More information can be found on this project on the Final Report PDF document.

## How to Use

Deploy each micro-service by the following order

1. MongoDB
2. Redis
3. MySQL
4. AuthService
5. Crosswalks
6. Proximity Manager
7. API Gateway or Backend
8. Frontend

The deployment proccess has been simplified and can be done by using Docker Compose, through the following commands, on the same directory location as this README file.

```bash
$ docker-compose down -v
$ docker-compose up --build
```



### Default Admin Account

In order to fully test the plataform, one can use the following default account

- Username: admin
- Password: admin

## Simulator

Under the Simulator folder, features a simulation NodeJS app built upon WebSockets. To run, after successfully installation of node packages, simply run

```bash
node index
```

The simulation can be seen on the Frontend React application, under the map view.

### Group Elements

This solution has been implemented by the following authors

- [César Borges](https://github.com/CesarAugustoBorges)
- [Fábio Senra](https://github.com/FabioSenra)
- [Miguel Solans](https://github.com/miguelsolans)


