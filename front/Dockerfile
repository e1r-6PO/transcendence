FROM debian:latest

WORKDIR /front

RUN apt update && apt install -y npm

COPY . /front

RUN npm i

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start"]
