FROM node:11.5-alpine

RUN mkdir -p /var/www/client

WORKDIR /var/www/client

# Prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

CMD yarn dev