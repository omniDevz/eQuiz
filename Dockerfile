FROM mhart/alpine-node:latest

WORKDIR /equiz

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn

COPY . .

EXPOSE 8080

CMD ["yarn", "start"]
