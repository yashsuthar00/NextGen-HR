FROM node:23.7-slim

COPY package.json package-lock.json /app/
COPY . /app/

WORKDIR /app

RUN npm install

EXPOSE 8000

CMD ["node", "src/server.js"]