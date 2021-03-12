# pull official base image
FROM node:13.12.0-alpine

# copy everything over
COPY . ./app

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json /app
COPY package-lock.json /app
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install serve@11.3.2 -g --silent

# build app
RUN npm run build
