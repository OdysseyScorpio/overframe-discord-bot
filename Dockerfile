FROM node:14

COPY . .

WORKDIR /

RUN npm install

ENV DIR=/JSON
ENV CMD=$

CMD ["npm", "run" , "bot"]