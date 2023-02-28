#!/bin/bash
# enable and start firewall
sudo systemctl enable firewalld
sudo systemctl start firewalld

sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
sudo firewall-cmd --zone=public --add-port=443/tcp --permanent
sudo firewall-cmd --zone=public --add-port=3000/tcp --permanent

sudo firewall-cmd --reload