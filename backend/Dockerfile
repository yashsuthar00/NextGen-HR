FROM node:23.7-slim

COPY package.json package-lock.json /app/
COPY . /app/

WORKDIR /app

RUN npm install
RUN npm install -g nodemon

EXPOSE 8000

CMD ["nodemon", "--watch", ".", "--exec", "node", "src/server.js"]