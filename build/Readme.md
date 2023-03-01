# Instructions for build set up

This document will define the steps taken to deploy the web application.

## Configure Vagrant, Packer and Terraform

Prerequisites require that Vagrant and Packer be set up prior to this tutorial. Using the secret tokens and variables provided, follow these additional [tutorials](https://github.com/illinoistech-itm/jhajek/tree/master/itmt-430/IT-Operations-cloud-connect-tutorial) to connect to the host ITMT430 server (192.168.172.0/24).

## Build Server

The build server is only accessible through VPN or local connection on campus. To connect, use the given username and password provided to you via email from Hajek and login as usual. A successful connection is shown here:

![IIT VPN](media/rice-vpn.png "VPN connection")


### Keygen

You are now able to SSH into the server via your console or terminal. Using the command `ssh -i path-to-private-key USERNAME@system44.rice.it.edu`, enter the build server. Upon inital opening, you will need to create an additional SSH key for app cloning. Use `ssh-keygen -t ed25519` to generate a new key, with the name "id_ed25519_buildserver_github_key" - remember where you put it as it will be needed for the GitHub key. Open the public key using cat to reveal the public key we need to insert into GitHub. Copy the contents, then go to the team repo on GitHub using your web browser, settings, then to SSH and GPG keys. Insert the public key, name it something related to the build server so you don't forget! 

### Config

Now we need to make a config file to access GitHub from our build server. To make a config file in our home directory, use the command `vim ~/.ssh/config`. Edit the file to match the contents below, changing the variables to match your GitHub account name and key. If you did not name your key this, change it to the name you chose. 

![config](media/config.png "config creation")

Now to connect, run `ssh git@github.com` - it should say you've been successfully authenticated. You are now able to clone the repo. Using `git clone https://github.com/illinoistech-itm/team-6o-2023.git`, execute this once. This will allow you to pull any updates from the repository. 

### Packer

Packer is used to create virtual machine templates for our deployment. To use Packer, we will change a few variables for our application. Go to the team-6o repo /build/example-code/packer/proxmox-jammy-ubuntu-front-back-template directory. Here we will see template-for-variables.pkr.hcl, which name must be changed to variables.pkr.hcl. Using the tokens and secrets provided to you (check email and Discord), insert them in the appropriate places. 

Then, go to the subiquity/http directory and locate template-user-data as it will need to be changed to user-data. We will need to generate another key for line 56 in user-data. Move to the proxmox-jammy-ubuntu-front-back-template directory and execute `ssh-keygen -t ed25519' with the name "./id_ed25519_packer_terraform_key" so it stays in this directory. We want to copy the public key for user-data, so using cat, copy over the contents to line 56. This will allow us access to any instances we make. It should look like this:

![User data](media/user-data-56.png "User data key")

Next, you will need to copy your config and public key (first key we generated) over to the proxmox-jammy-ubuntu-front-back-template directory so Packer can locate it for the app cloning during the build. Then, use `vim config` as we need to edit a small line to put the key into our instance.

![Packer config](media/packer-config.png "Packer config")


Once you've done so, run `packer init .` if it's the first time to grab any dependencies. Then, `packer validate .`to ensure configuration is valid. Sometimes when pulling updates, files will duplicate since we changed the names and added it to our gitignore. Simply remove the template files, or the configuration will not validate.

![Dupe](media/rm-temp.png "Remove temp file")

If yes, proceed with `packer build .` and allow for 20-40 minutes of build time. Once successful, you will see this in the Proxmox console (login using given username and password). To delete old VMs, click the desired one within the console and go to more in the top right corner. Choose remove and check both boxes.

![Proxmox](media/proxmox.png "Proxmox console")

### Terraform

Terraform will deploy our web app to resolved addresses on the build server. Like Packer, we must change some variables and file names before executing. Go to /build/example-code/proxmox-cloud-production-templates/terraform/proxmox-jammy-ubuntu-front-back-template directory and find template-terraform.tfvars and change its name to terraform-tfvars. Again, refer to the email and Discord secrets provided. 

Now we want to copy over the key we created called id_ed25519_packer_terraform_key to the terraform/proxmox-jammy-ubuntu-front-back-template directory. Go back to build/example-code/packer/proxmox-jammy-ubuntu-front-back-template and from there use the command `cp id_ed25519_packer_terraform_key ../../terraform/proxmox-jammy-ubuntu-front-back-template`. Verify that the key has been copied to the desired directory.

![Terraform key](media/terraform-key.png "Terraform key")

If it is the first time building, use `terraform init`. Then `terraform validate`, and if that command if valid, you can run `terraform apply`. If it is successful after about 10 minutes, there will be an output of the resolved addresses to the front and back end. We can SSH into these VMs by using `ssh -i id_ed25519_packer_terraform_key vagrant@ADDRESS`

![Terraform](media/prox-addresses.png "Terraform addresses")

To destroy or delete the deployment, use `terraform destroy` and allow around 5 minutes after the destroy before using `terraform apply` again. 

