FROM node:4

COPY . /src/app/

RUN cd /src/app/; npm install; npm rebuild; npm run build

EXPOSE 5000
WORKDIR /src/app/build

CMD ["node", "server.js"]
