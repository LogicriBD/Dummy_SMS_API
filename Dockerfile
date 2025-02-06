# Here we are getting our node as Base image
FROM node:20.5-alpine

# install pm2 package globally
RUN npm install pm2 -g

# RUN apk add --no-cache udev ttf-freefont chromium git
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# ENV CHROMIUM_PATH /usr/bin/chromium-browser

# create user in the docker image
USER node

# Creating a new directory for app files and setting path in the container
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# setting working directory in the container
WORKDIR /home/node/app

# (copy package.json + run install packages) before copying codebase to avoid installing packages unnecessarily
COPY package.json ./

# installing the dependencies into the container
RUN npm install

# grant permission of node project directory to node user
COPY --chown=node:node . .

# container exposed network port number
EXPOSE 10000

# build the codebase
RUN npm run build

# command to run within the container
CMD ["npm", "run", "start"]