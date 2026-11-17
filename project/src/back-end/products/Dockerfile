FROM node:20-alpine
WORKDIR /usr/src/products-service

ENV PATH /usr/src/products-service/node_modules/.bin:${PATH}
ENV DEBUG products-d

ADD package.json .
RUN npm install

ADD src src
ADD seed seed

RUN apk update && apk add bash curl
ADD boot-in-order.sh .
RUN chmod +x boot-in-order.sh
CMD ["./boot-in-order.sh"]