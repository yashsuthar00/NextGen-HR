FROM node:23-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

ENTRYPOINT ["nodemon", "--watch", ".", "--exec", "npm", "run", "dev", "--", "--port=3000", "--host=0.0.0.0"]