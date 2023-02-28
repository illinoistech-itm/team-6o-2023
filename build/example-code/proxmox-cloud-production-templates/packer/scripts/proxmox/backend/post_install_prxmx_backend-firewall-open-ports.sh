#!/bin/bash
# enable and start firewall
sudo systemctl enable firewalld
sudo systemctl start firewalld

# port for mariadb
sudo firewall-cmd --zone=meta-network --add-port=3306/tcp --permanent

sudo firewall-cmd --reload