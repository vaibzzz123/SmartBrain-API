# Specify the base image
FROM node:18.17.1-alpine3.17

# Create app directory inside the Docker image
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and yarn.lock to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

# Run the application as a non-root user.
USER node

# Bundle app source inside Docker image
COPY . .

# Your app binds to port 3001 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3001

# Expose the debugging port
EXPOSE 9229

# Define the command to run your app using CMD which defines your runtime
CMD ./run.sh