FROM node:14.15.4-alpine3.12
WORKDIR /usr/app
COPY package.json ./
RUN yarn install
COPY . .
