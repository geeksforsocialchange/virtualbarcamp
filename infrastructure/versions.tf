terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
    }
    acme = {
      source  = "vancluever/acme"
      version = ">= 2.1.2"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
    tls = {
      source = "hashicorp/tls"
    }
  }
  required_version = ">= 0.13"
}
