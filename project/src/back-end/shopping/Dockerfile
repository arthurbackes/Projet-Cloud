FROM node:18-alpine
RUN apk add --no-cache curl bash
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x boot-in-order.sh
EXPOSE 80
CMD ["node", "daemon.js"]