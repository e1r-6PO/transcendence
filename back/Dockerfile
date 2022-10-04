FROM debian:latest

WORKDIR /back

RUN apt update && apt install -y npm

COPY . /back

RUN npm i --legacy-peer-deps

RUN mkdir /data /data/image_tmp /data/users

EXPOSE 3000

CMD ["npm", "run", "start"]
