# Local Environment
This tutorial will cover how to get the environment for the team repository on your local machine. First, make sure you have cloned the team repo. From your terminal or console, change directories into the local folder, then to packer, and lastly local_build_ubuntu_22041_vanilla. Boxes may need to be removed prior if your have ran packer in this directory before to update to the new enviornment. 

You will need to change template-user-data to user-data and template-for-variables.pkr.hcl to variables.pkr.hcl for Packer to properly read the parameters. Change and add any variables to the mentioned files from the secrets and tutorials provided. 

If you have not ran before, use packer init . and allow the dependencies to install. After that is finished, run, packer validate . to confirm the syntax and necessary variables are correct. If the confirmation is valid, proceed with packer build . and allow for 20-40 minutes of build time.