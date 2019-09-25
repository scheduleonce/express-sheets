FROM node:10-alpine

# Create app directory
RUN mkdir -p /usr/src/express-sheets
WORKDIR /usr/src/express-sheets

# Install app dependencies
COPY package*.json /usr/src/express-sheets/
RUN npm install

# Bundle app source
COPY . /usr/src/express-sheets
RUN npm run build

EXPOSE 3000

CMD npm run start