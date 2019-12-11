FROM jenkins/jenkins:lts
USER root
RUN apt-get clean && apt-get update && \
    apt-get install -y make python && \
    wget https://get.helm.sh/helm-v2.14.3-linux-amd64.tar.gz && \
    tar -xvf helm-v2.14.3-linux-amd64.tar.gz && \
    mv linux-amd64/helm /usr/bin/helm && \
    echo "git config --global core.sshCommand 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'" >> /etc/profile && \
    rm -rf helm-v2.14.3-linux-amd64.tar.gz linux-amd64
USER jenkins
