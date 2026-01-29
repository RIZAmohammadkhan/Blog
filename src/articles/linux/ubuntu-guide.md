---
title: Ubuntu Setup Guide
readTime: 6 min
date: 2026-01-10
tags: ubuntu, linux
image: /images/linux-ubuntu.jpg
---


## Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Essential packages
sudo apt install git curl wget build-essential

# Install VS Code
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
```

## Development Environment

### Node.js via NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

### Docker

```bash
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
```

## Recommended Tools

- **Terminator** - Better terminal
- **htop** - Process viewer
- **tldr** - Simplified man pages
