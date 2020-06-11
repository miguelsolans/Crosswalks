# NodeJS Version
FROM node:lts-alpine

# App Directory
WORKDIR /crosswalk/services/auth

# Install App dependencies
COPY package*.json ./

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

RUN npm install

# Ubdle App source
COPY . . 

# Expose App Port
EXPOSE 4042

# Run App
# CMD [ "npm", "test" ]
CMD /wait && npm start