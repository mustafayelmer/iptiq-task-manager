# Use node 15 image.
FROM node:15-slim

# app
WORKDIR /usr/src/app

COPY ./src ./src
COPY package.json ./
COPY tsconfig.json ./

# install dependencies
RUN npm install

# select default port
EXPOSE 8080
CMD [ "npm","run","start" ]

