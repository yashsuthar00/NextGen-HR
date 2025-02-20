FROM node:23.7-slim

WORKDIR /app

COPY . /app/

RUN npm install

EXPOSE 5000

CMD ["node", "src/server.js"]