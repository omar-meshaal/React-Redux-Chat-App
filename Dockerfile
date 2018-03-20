FROM node:carbon

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY .babelrc ./

RUN npm install 
# If you are building your code for production

# Bundle app source
COPY /src /usr/app/src/
EXPOSE 3000
CMD [ "npm","start" ]
