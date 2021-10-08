```
docker run -p 3306:3306 --name mariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw -d mariadb:latest
docker run --name myadmin -d --link <mariad_db_container_id> -p 8080:80 phpmyadmin
```