# pull official base image
FROM node:latest

WORKDIR '/app'

# set working directory
# COPY package*.json .
COPY . .
## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

# Install dependencies 
RUN npm install --silent

# COPY . .

# EXPOSE 3000

# CMD [ "npm", "start" ]
CMD /wait && npm start