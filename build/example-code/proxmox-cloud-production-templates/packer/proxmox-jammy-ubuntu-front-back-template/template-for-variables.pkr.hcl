//  variables.pkr.hcl

// For those variables that you don't provide a default for, you must
// set them from the command line, a var-file, or the environment.

# This is the name of the node in the Cloud Cluster where to deploy the virtual instances
variable "NODENAME" {
  type    = string
  default = ""
}

variable "TOKEN_ID" {
  sensitive = true
  type      = string
  default   = ""
}

variable "TOKEN_SECRET" {
  sensitive = true
  type      = string
  default   = ""
}

variable "URL" {
  type = string
  # https://x.x.x.x:8006/api2/json
  default   = ""
  sensitive = true
}

variable "MEMORY" {
  type    = string
  default = "4192"
}

# Best to keep this low -- you can expand the size of a disk when deploying 
# instances from templates - but not reduce the disk size -- No need to edit this
variable "DISKSIZE" {
  type    = string
  default = "25G"
}

# This is the name of the disk the build template will be stored on in the 
# Proxmox cloud -- No need to edit this
variable "STORAGEPOOL" {
  type    = string
  default = "datadisk3"
}

variable "NUMBEROFCORES" {
  type    = string
  default = "1"
}

# This is the name of the Virtual Machine Template you want to create
variable "frontend-VMNAME" {
  type    = string
  default = ""
}

# This is the name of the Virtual Machine Template you want to create
variable "backend-VMNAME" {
  type    = string
  default = ""
}

# This is the name of the Virtual Machine Template you want to create
variable "loadbalancer-VMNAME" {
  type    = string
  default = ""
}

# This is the password set in the subiquity/http/user-data line 9,
# default password is vagrant, and password auth will be remove 
# and replaced with Public Key Authentication at run time --
# This is only for build time

variable "ISO-CHECKSUM" {
  type    = string
  default = "sha256:5e38b55d57d94ff029719342357325ed3bda38fa80054f9330dc789cd2d43931"
}

variable "ISO-URL" {
  type    = string
  default = "https://mirrors.edge.kernel.org/ubuntu-releases/22.04.2/ubuntu-22.04.2-live-server-amd64.iso"
}

# This variable is the IP address range to allow your connections
variable "CONNECTIONFROMIPRANGE" {
  type      = string
  sensitive = true
  default   = "REPLACE"
}

variable "AUTHURI" {
  type = string
  sensitive = true
  default = ""
}

variable "TOKENURI" {
  type = string
  sensitive = true
  default = ""
}

variable "CERTIFICATE" {
  type = string
  sensitive = true
  default = ""
}

variable "ORIGIN1" {
  type = string
  sensitive = true
  default = ""
}

variable "ORIGIN2" {
  type = string
  sensitive = true
  default = ""
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  user-ssh-password = vault("/secret/data/team6o-ssh","SSHPASS")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  db_user = vault("/secret/data/team6o-db", "DBUSER")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  db_pass = vault("/secret/data/team6o-db", "DBPASS")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  db_name = vault("/secret/data/team6o-db", "DATABASENAME")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  db_FQDN = vault("/secret/data/team6o-db", "FQDN")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  aws_access = vault("/secret/data/team6o-cred", "AWSACCESS")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  aws_bucket = vault("/secret/data/team6o-cred", "AWSBUCKET")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  aws_secret = vault("/secret/data/team6o-cred", "AWSSECRET")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  client_id = vault("/secret/data/team6o-cred", "CLIENTID")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  project_id = vault("/secret/data/team6o-cred", "PROJECTID")
}

# Syntax
# https://developer.hashicorp.com/packer/docs/templates/hcl_templates/functions/contextual/vault
locals {
  secret = vault("/secret/data/team6o-cred", "SECRET")
}