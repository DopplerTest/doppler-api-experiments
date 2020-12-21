FROM node:lts-alpine

WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY app.js config.js /usr/src/app/
CMD ["node", "app.js"]
