FROM node:18.16.1-alpine

LABEL authors="Seyun Jang"

WORKDIR /app

COPY package.json .

RUN npm install pnpm -g

RUN npm install pm2 -g

RUN pnpm install

COPY . .

EXPOSE 80

CMD ["pnpm", "start:prod"]