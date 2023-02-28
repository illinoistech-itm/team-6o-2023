#!/bin/bash 
set -e
set -v

# http://superuser.com/questions/196848/how-do-i-create-an-administrator-user-on-ubuntu
# http://unix.stackexchange.com/questions/1416/redirecting-stdout-to-a-file-you-dont-have-write-permission-on
# This line assumes the user you created in the preseed directory is ubuntu
echo "%admin  ALL=NOPASSWD: ALL" | sudo tee -a /etc/sudoers.d/init-users
sudo groupadd admin
sudo usermod -a -G admin vagrant

##################################################
# Add User customizations below here
##################################################

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
su - vagrant -c https://github.com/illinoistech-itm/team-6o-2023.git
cd ./team-6o-2023/code/

# Upgrade to latest NPM
sudo npm install -g npm@9.4.2

# Install expressjs, multer and pm2
sudo npm install express multer pm2

# Install EJS - Embedded JavaScript templates
# https://ejs.co/
npm install ejs

# Start the nodejs app where it is located via PM2
# Command to create a service handler and start that javascript app at boot time
pm2 startup

# The pm2 startup command generates this command
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant

sudo pm2 start server.js
