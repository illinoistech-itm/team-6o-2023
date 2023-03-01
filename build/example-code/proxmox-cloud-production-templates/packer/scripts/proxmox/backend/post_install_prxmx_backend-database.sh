#!/bin/bash

# Install and prepare backend database

sudo apt update
sudo apt-get install -y mariadb-server

# The command: su - vagrant -c switches from root to the user vagrant to execute the git clone command
# Clone the backend code from team repo
su - vagrant -c "git clone git@github.com:illinoistech-itm/team-6o-2023.git"
cd ./team-6o-2023/code/

sudo systemctl enable mariadb.service
sudo systemctl start mariadb.service

# Run script for database setup

sed -i "s/\$USERPASS/$USERPASS/g" ./database/*.sql
sed -i "s/\$USERNAME/$USERNAME/g" ./database/*.sql

sudo mysql < /home/vagrant/team-6o-2023/code/database/create-database.sql
sudo mysql < /home/vagrant/team-6o-2023/code/database/create-table.sql
sudo mysql < /home/vagrant/team-6o-2023/code/database/create-user-with-permissions.sql