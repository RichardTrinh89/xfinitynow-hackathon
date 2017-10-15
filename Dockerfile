FROM quay.io/golfchannel/jessie-node:latest
LABEL maintainer="Richard Trinh" email="<richard.trinh@golfchannel.com>"

COPY ./src /src
WORKDIR /src

RUN npm install --silent

ENTRYPOINT ["npm", "start"]
