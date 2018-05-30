FROM ubuntu

RUN apt-get update && \
    apt-get install --yes curl gnupg && \
    curl --silent --location https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs build-essential python-pip python-dev libssl-dev libffi-dev ssh sshpass rsync && \
    pip install ansible && \
    rm -rf /var/lib/apt/lists/*

COPY files/src-playbooks /opt/ansible/playbooks
COPY files/dist-api /opt/app-api/dist-api
COPY files/node_modules /opt/app-api/node_modules
COPY ssh /root/.ssh
COPY start-cmd.sh /start-cmd.sh

RUN chmod -R o-rwx /root/.ssh && \
    chmod -R g-rwx /root/.ssh && \
    chmod +x /*.sh

CMD ["/start-cmd.sh"]
