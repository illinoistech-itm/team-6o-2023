#!/bin/bash

## Assuming the cloning of the team repo has taken place
# this will move all the three Nginx configuration files needed
# to allow the load balancing to take place
# Change team00 to your team repo

cd /home/vagrant
su - vagrant -c "git clone git@github.com:illinoistech-itm/team-6o-2023.git"

# This overrides the default nginx conf file enabling loadbalacning and 443 TLS only
sudo cp -v /home/vagrant/team-6o-2023/code/nginx/nginx.conf /etc/nginx/
sudo cp -v /home/vagrant/team-6o-2023/code/nginx/default /etc/nginx/sites-available/
# This connects the TLS certs built in this script with the instances
sudo cp -v /home/vagrant/team-6o-2023/code/nginx/self-signed.conf /etc/nginx/snippets/

sudo systemctl daemon-reload
