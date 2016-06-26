FROM node:argon

RUN mkdir -p /usr/src/app
ADD . /usr/src/app

# Install global app dependencies
RUN npm install -g babel
RUN npm install -g babel-cli


# Install dependencies
WORKDIR /usr/src/app
RUN npm install

EXPOSE 8080
CMD npm start
