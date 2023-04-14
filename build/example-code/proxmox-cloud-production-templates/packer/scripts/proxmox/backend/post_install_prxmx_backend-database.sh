#!/bin/bash

# Install and prepare backend database

sudo apt update
sudo apt-get install -y mariadb-server

# The command: su - vagrant -c switches from root to the user vagrant to execute the git clone command
# Clone the backend code from team repo
su - vagrant -c "git clone git@github.com:illinoistech-itm/team-6o-2023.git"

## During the Terraform apply phase -- we will make some run time adjustments
# to configure the database to listen on the meta-network interface only

#############################################################################
# Using the variables you are passing via the variables.pkr.hcl file, you can
# access those variables as Linux ENVIRONMENT variables, use find and replace
# via sed and inline execute an inline mysql command
# Albiet this looks a bit hacky -- but it allows us not to hard code 
# secrets into our systems when building your backend template 
#############################################################################

# Allow mariadb to access remote connections
cd /etc/mysql/mariadb.conf.d/
sudo sed -i "s/bind-address/#bind-address/" 50-server.cnf

# Change directory to the location of your JS code
cd /home/vagrant/team-6o-2023/code/database

# Inline MySQL code that uses the secrets passed via the ENVIRONMENT VARIABLES to create a non-root user
# IPRANGE is "10.110.%.%"
echo "Executing inline mysql -e to create user..."
sudo mysql -e "GRANT ALL PRIVILEGES ON team6o.* TO '${DBUSER}'@'${IPRANGE}' IDENTIFIED BY '${DBPASS}';"

# Inlein mysql to allow the USERNAME you passed in via the variables.pkr.hcl file to access the Mariadb/MySQL commandline 
# for debugging purposes only to connect via localhost (or the mysql CLI)

sudo mysql -e "GRANT SELECT,INSERT,CREATE TEMPORARY TABLES ON team6o.* TO '${DBUSER}'@'localhost' IDENTIFIED BY '${DBPASS}';"

# These sample files are located in the mysql directory but need to be part of 
# your private team repo
sudo mysql < ./create-database.sql
sudo mysql < ./create-table.sql
sudo mysql < ./create-user-with-permissions.sql
sudo mysql < ./preseed-users.sql
sudo mysql < ./preseed-posts.sql
sudo mysql < ./preseed-comments.sql