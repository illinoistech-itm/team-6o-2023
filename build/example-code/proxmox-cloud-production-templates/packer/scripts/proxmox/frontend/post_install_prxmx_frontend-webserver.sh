#!/bin/bash
#set -e
#set -v
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
cd ./team-6o-2023/code/Pug_Build

# Upgrade to latest NPM
npm install -g npm@9.5.1

# Point to package.json file
sudo npm install -y
sudo npm install pm2 -g

# Create a new file called credentials.json
# Enter credentials into the file
touch data/credentials.txt

# Enter credentials into the file
sed -i "s,\$CLIENTID,$CLIENTID,g" ./data/*.txt
sed -i "s,\$PROJECTID,$PROJECTID,g" ./data/*.txt
sed -i "s,\$AUTHURI,$AUTHURI,g" ./data/*.txt
sed -i "s,\$TOKENURI,$TOKENURI,g" ./data/*.txt
sed -i "s,\$CERTIFICATE,$CERTIFICATE,g" ./data/*.txt
sed -i "s,\$SECRET,$SECRET,g" ./data/*.txt
sed -i "s,\$ORIGIN1,$ORIGIN1,g" ./data/*.txt
sed -i "s,\$ORIGIN2,$ORIGIN2,g" ./data/*.txt

# Rename the file to credentials.json
mv data/credentials.txt data/credentials.json

# execute nohup command to run the server in the background, web server runs on port 3000
#nohup npm run start &
sudo npm i 
sudo pm2 start “npm run dev” —name team6o