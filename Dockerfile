FROM node:10-alpine

WORKDIR /app

ADD . /app

COPY package*.json ./

RUN ["npm", "install"]

RUN ["npm", "run", "compile"]

EXPOSE 3001

CMD ["/app/dist/bin/boot.js"]
