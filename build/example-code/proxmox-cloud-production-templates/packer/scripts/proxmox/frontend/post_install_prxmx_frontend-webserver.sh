#!/bin/bash

# Install and prepare frontend web server

sudo apt-get update
sudo apt-get install -y nginx curl rsync

# How to generate a self-signed TLS cert

# https://github.com/nodesource/distributions/blob/master/README.md#using-ubuntu-2
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
# https://ethitter.com/2016/05/generating-a-csr-with-san-at-the-command-line/
sudo openssl req -x509 -nodes -days 365 -newkey rsa:4096  -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt -subj "/C=US/ST=IL/L=Chicago/O=IIT/OU=rice/CN=iit.edu"
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

# The command: su - vagrant -c switches from root to the user vagrant to execute the git clone command
# Clone the frontend code from team repo
su - vagrant -c "git clone git@github.com:illinoistech-itm/team-6o-2023.git"
cd ./team-6o-2023/code/Test_Build

# Upgrade to latest NPM
npm install -g npm@9.4.2
sudo npm install -y

# Install expressjs and pm2
sudo npm install express pm2

# Start the nodejs app where it is located via PM2
# Command to create a service handler and start that javascript app at boot time
pm2 startup

# The pm2 startup command generates this command
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant

sudo pm2 start server.js
