# transcendence

# For now
```
# fill the .env file in back/.env
docker run -p 3306:3306 --name mariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw -e MYSQL_DATABASE=transcendence -d mariadb:latest
docker run --name myadmin -d -e PMA_HOST=172.17.0.2 -p 8080:80 phpmyadmin
cd back && npm i && npm run start:dev
cd front && npm i && npm run dev
```
