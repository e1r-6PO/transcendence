FROM debian:latest

RUN apt update && apt install -y npm procps

WORKDIR /back

CMD ["npm", "run", "start:dev"]
