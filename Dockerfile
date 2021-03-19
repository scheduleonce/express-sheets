# express-sheets build
FROM node:12.22.1-alpine3.12 AS build
RUN mkdir -p /usr/src/express-sheets
WORKDIR /usr/src/express-sheets
COPY package*.json /usr/src/express-sheets/
RUN npm install
COPY . /usr/src/express-sheets
RUN npm run build

# production dependencies
FROM node:12.22.1-alpine3.12 AS dependencies
RUN mkdir -p /usr/src/express-sheets
WORKDIR /usr/src/express-sheets
COPY package*.json /usr/src/express-sheets/
RUN npm install --production

# express-sheets image build
FROM node:12.22.1-alpine3.12
RUN mkdir -p /usr/src/express-sheets
WORKDIR /usr/src/express-sheets
COPY --from=dependencies /usr/src/express-sheets/node_modules ./node_modules/
COPY --from=build /usr/src/express-sheets/dist ./dist/

EXPOSE 3000

CMD ["node", "dist/src/app.js"]
