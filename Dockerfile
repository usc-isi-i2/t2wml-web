# First stage - build the output
FROM node:16

# create app directory
RUN mkdir /app

# copy the source over
ADD src /app/src
ADD public /app/public

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

# set the backend url environment variable
ARG REACT_APP_BACKEND_URL=http://0.0.0.0:13000
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# build app
RUN npm run build

# Second stage - serve it
FROM nginx:latest

COPY --from=0 /app/build /usr/share/nginx/html

