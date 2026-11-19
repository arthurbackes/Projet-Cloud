FROM node:22-alpine
WORKDIR /usr/src/shopping-service

ENV PATH /usr/src/shopping-service/node_modules/.bin:${PATH}

COPY package*.json ./
RUN npm install

COPY src ./src
RUN apk add --no-cache bash curl
COPY boot-in-order.sh ./
RUN chmod +x boot-in-order.sh

EXPOSE 80
CMD ["./boot-in-order.sh"]