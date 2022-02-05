# tronscendence

Tronscendence is a website about playing pong based on a Tron theme it aimed to help us discover how modern web site are builded.  
It uses a combination of nestJS (back) and nuxtJS (front) with a completly revamped vuetify to achieve a tron theme.

# Install
## In production:

Modify docker-compose.yml following lines at your convenience:
```
POSTGRES_USER: <username>
POSTGRES_PASSWORD: <password>
```

Fill back/.env with the following variable:
```
GOOGLE_CLIENT_ID=<googleClientId> // https://console.cloud.google.com/apis/credentials
GOOGLE_SECRET=<googleSecret>
QD_USER_ID=<42UID>                // https://profile.intra.42.fr/oauth/applications
QD_SECRET=<42Secret>
GITHUB_CLIENT_ID=<githubClientId> // https://github.com/settings/developers
GITHUB_SECRET=<githubSecret>
DBUSER=<docker-composePOSTGRES_PASSWORD>
DBPSWD=<docker-composeDatabasePassword>
DBHOST=transcendence-database
DATADIR=/data
HOST=<publicIP>:<port>            // or domain name etc...
PROTOCOL=<http/https>			  // need testing but works with http
JWT_SECRET=<randomPassphrase>
```

Fill front/.env with the following variable:
```
HOST=<publicIP>:<port>      // should probably be the same as back HOST variable
BACKHOST=<publicIP>:<port>  // same
```

and run: `docker-compose up`

## In dev:

Same as production but apply the following changes:

In back/.env the following lines changes:
```
DBHOST=<databaseHost>   // should be localhost
DATADIR=../data
HOST=<frontIP>:<port>   // should be localhost:8000
```

In front/.env:
```
HOST=<frontIP>:<port>       // should be localhost:8000
BACKHOST=<publicIP>:<port>  // should be localhost:3000
```

in front/nuxt.config.js uncomment the following lines:
```
proxy: {
  /api': { target: 'http://localhost:    3000/api', pathRewrite:{'^/api': ''} }
},
```

and run:
- in back: `npm run start:dev`
- in front: `npm run dev`

If you do not wish to use one of the provider leave it's variable blank and edit `back/src/module/auth.module.ts` and remove <provider>Strategy l21.  
  
For dev you can switch to a mysql database by uncommenting:

```
.where('player0Id = :id', { id })         // back/src/service/users.service.ts
.orWhere('player1Id = :id', { id })       // back/src/service/users.service.ts
```
and commenting:
```
.where('matchs.player0 = :id', { id })    // back/src/service/users.service.ts
.orWhere('matchs.player1 = :id', { id })  // back/src/service/users.service.ts
```
  
and by switching from `postgres` to `mysql` in `back/src/module/db.connect.module.ts`

  
TODO:
- Better sound
- Notification
- Use store
- Dont destroy vuetify (impossible)
