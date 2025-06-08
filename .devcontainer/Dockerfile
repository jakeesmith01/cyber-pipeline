FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends gnupg2 zsh

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

RUN if [[-v "$CODESPACE_NAME"]]; then \
    export APP_HOSTNAME=$CODESPACE_NAME"-3001.app.github.dev"; \
fi 
 
# [Optional] Uncomment if you want to install more global node modules
RUN su node -c "npm install -g npm-check-updates better-commits"
