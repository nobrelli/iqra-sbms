FROM node:20.12.2-alpine3.18 AS builder

RUN apk update && apk upgrade

WORKDIR /home/iqra-sbms-client

COPY package.json yarn.lock ./

RUN npm install --global --force yarn && yarn install --verbose

ENV VITE_APP_VERSION='2.0'
ENV VITE_API_URL='http://localhost:5000/api/v2'
ENV VITE_CSRF_TOKEN_NAME='iqra-csrf'
ENV VITE_PERSISTENT_STORE_NAME='iqra-store'

COPY . .

RUN yarn build:prod

FROM nginx:mainline-alpine3.20-slim as serve

COPY --from=builder /home/iqra-sbms-client/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /home/iqra-sbms-client/dist /usr/share/nginx/html

EXPOSE 80