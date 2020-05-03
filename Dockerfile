FROM node:7
WORKDIR /node_bank
COPY /home/ec2-user/tmp/package.json /node_bank
RUN npm install
COPY . /node_bank
CMD node app.js
EXPOSE 3000
