# Use a lighter version of Node as a parent image
FROM node:10
# Set the working directory to /api
WORKDIR /usr/src/api
# copy package.json into the container at /api
COPY package*.json /usr/src/api/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /api
COPY . /usr/src/api/
# Make port 80 available to the world outside this container
EXPOSE 8081
# Run the app when the container launches
CMD ["yarn", "dev"]