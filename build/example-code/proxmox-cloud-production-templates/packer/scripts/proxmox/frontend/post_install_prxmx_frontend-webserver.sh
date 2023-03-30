#!/bin/bash
set -e
set -v
# Install and prepare frontend web server

sudo apt-get update
sudo apt-get install -y curl rsync

# https://github.com/nodesource/distributions/blob/master/README.md#using-ubuntu-2
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# The command: su - vagrant -c switches from root to the user vagrant to execute the git clone command
# Clone the frontend code from team repo
su - vagrant -c "git clone git@github.com:illinoistech-itm/team-6o-2023.git"
cd ./team-6o-2023/code/Pug_Build

touch .env

printf "FQDN=\nDBUSER=\nDBPASS=\nDATABASE=\n" >> .env

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

# Use pm2 to run the server on port 3000
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant
pm2 start "npm run start" --name team6o

# Save the state of process list
pm2 save
sudo chown vagrant:vagrant /home/vagrant/.pm2/rpc.sock /home/vagrant/.pm2/pub.sock

###############################################################################
# Using Find and Replace via sed to add in the secrets to connect to MySQL
# There is a .env file containing an empty template of secrets -- essentially
# this is a hack to pass environment variables into the vm instances
###############################################################################

sudo sed -i "s/FQDN=/DATABASE_HOST=$FQDN/" /home/vagrant/team-6o-2023/code/Pug_Build/.env
sudo sed -i "s/DBUSER=/DATABASE_USERNAME=$DBUSER/" /home/vagrant/team-6o-2023/code/Pug_Build/.env
sudo sed -i "s/DBPASS=/DATABASE_PASSWORD=$DBPASS/" /home/vagrant/team-6o-2023/code/Pug_Build/.env
sudo sed -i "s/DATABASE=/DATABASE_NAME=$DATABASE/" /home/vagrant/team-6o-2023/code/Pug_Build/.env
