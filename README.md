# tronscendence

Tronscendence is a website about playing pong based on a Tron theme it aimed to help us discover how modern web site are builded.  
It uses a combination of nestJS (back) and nuxtJS (front) with a completly revamped vuetify to achieve a tron theme.

# Install
In production:

Modify docker-compose.yml following lines at your convenience:
```
POSTGRES_USER: <username>
POSTGRES_PASSWORD: <password>
```

Fill back/.env with the following variable:
```
GOOGLE_CLIENT_ID=<googleClientId> // https://console.cloud.google.com/apis/credentials
GOOGLE_SECRET=<googleSecret>
QD_USER_ID=<42UID> // https://profile.intra.42.fr/oauth/applications
QD_SECRET=<42Secret>
GITHUB_CLIENT_ID=<githubClientId> // https://github.com/settings/developers
GITHUB_SECRET=<githubSecret>
DBUSER=<docker-composePOSTGRES_PASSWORD>
DBPSWD=<docker-composeDatabasePassword>
DBHOST=transcendence-database
DATADIR=/data
HOST=<publicIP>:80
JWT_SECRET=<randomPassphrase>
```

If you do not wish to use one of the provider leave it's variable blank and edit `back/src/module/auth.module.ts` and remove <provider>Strategy l21.  

# For now
```
# fill the .env file in back/.env
docker run -p 3306:3306 --name mariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw -e MYSQL_DATABASE=transcendence -d mariadb:latest
docker run --name myadmin -d -e PMA_HOST=172.17.0.2 -p 8080:80 phpmyadmin
cd back && npm i && npm run start:dev
cd front && npm i && npm run dev
```
