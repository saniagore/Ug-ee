FROM node:18

RUN apt-get update && apt-get install -y build-essential python3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]