FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN npm i cors
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
COPY . .

EXPOSE 8080


CMD sed -ie "s#host: "http://127.0.0.1:8080"#host: \"$BACKEND_URL\"#" src/config.js  && \
    cat src/config.js  && \
    #sed -ie "s#proxy: 'http://localhost:5001'#proxy: \"$BACKEND_URL\"#" vue.config.js  && \
    npm run serve --port=8080
