# Specify the base image
FROM node:18.17.1-alpine3.17

# Create app directory inside the Docker image
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source inside Docker image
COPY . .

# Your app binds to port 3001 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3001

# Expose the debugging port
EXPOSE 9229

# Define the command to run your app using CMD which defines your runtime
CMD ./run.sh