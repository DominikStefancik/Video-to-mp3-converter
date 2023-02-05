FROM node:18.14-alpine

# Create app directory
RUN mkdir -p /authentication-service
WORKDIR /authentication-service

# Add all service files into the container
COPY . .

RUN yarn install && \
    yarn cache clean

CMD [ "yarn", "prod" ]

EXPOSE 3010