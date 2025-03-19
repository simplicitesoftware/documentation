---
sidebar_position: 11
title: Docker tutorial
---

Deploying Simplicité with Docker images tutorial
================================================

For this tutorial we use an out-of-the-box **CentOS 7**, **CentOS 8/AlmaLinux/RockyLinux** or **Debian** host but this can be transposed to any other host OS.

By following the steps below you should have an easily-maintainable **production-grade** deployment of Simplicité up and running **in a few minutes**.

Installation
------------

### System upgrade

This step is required to make sure your host system is up-to-date.

Update system on **CentOS 7**:

```bash
sudo yum -y update && sudo yum clean all
sudo reboot
```

Update system on **CentOS 8/AlmaLinux/RockyLinux**:

```bash
sudo dnf -y update && sudo dnf clean all
sudo reboot
```

Update system on **Debian**:

```bash
sudo apt-get update && sudo apt-get upgrade
sudo reboot
```

### Firewall setup

Although it is highly recommended, this step is not required if you have an external firewall which already
filters the access to your host.

Install and enable firewall  on **CentOS 7**:

```bash
sudo yum -y install firewalld && sudo yum clean all
sudo systemctl enable firewalld
sudo systemctl start firewalld
```

Install and enable firewall  on **CentOS 8/AlmaLinux/RockyLinux**:

```bash
sudo dnf -y install firewalld && sudo dnf clean all
```

> **Note**: > Depending on the version of Docker that you use and if your host is running **CentOS 8/AlmaLinux/RockyLinux** you may encounter issues with Docker networking vs firewall rules.
> In such a case, you can try changing the default firewall backend to iptables in `/etc/firewalld/firewalld.conf` (replace `FirewallBackend=nftables` by `FirewallBackend=iptables`).
> Note that some recent host kernels do not support iptables anymore, don't try this in this case.

```bash
sudo systemctl enable firewalld
sudo systemctl start firewalld
```

Install firewall on **Debian**:

```bash
sudo apt update
sudo apt -y install firewalld
```

Configure firewall:

```bash
sudo firewall-cmd --add-service=ssh --permanent
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --remove-service=cockpit --permanent
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

### Optional: Install other useful packages

This step is not required but provides various useful tools and aliases on your host.

Install other useful packages on **CentOS 7**:

```bash
sudo yum -y install vim-enhanced git wget curl zip unzip && sudo yum clean all
sudo yum -y install epel-release && sudo yum -y install certbot htop && sudo yum clean all
```

Install other useful packages on **CentOS 8/AlmaLinux/RockyLinux**:

```bash
sudo dnf -y install vim-enhanced git wget curl zip unzip && sudo dnf clean all
sudo dnf -y install epel-release && sudo dnf -y install certbot htop && sudo dnf clean all
```

Add these useful aliases to `~/.bashrc`:

```plaintext
cat << EOF >> .bashrc
alias vi=vim
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias dir='ls -alF'
alias d='sudo docker'
alias di='sudo docker images'
alias dp='sudo docker ps --all'
alias dv='sudo docker volume'
alias dc='sudo /usr/bin/docker-compose'
alias k='sudo kubectl'
EOF
. .bashrc
```

### Optional: Install database clients packages

This step is not required if you don't plan to connect to the deployed databases from your host.

Install database clients on **CentOS 7**:

```bash
sudo yum -y install mariadb postgresql && sudo yum clean all
```

Install database clients on **CentOS 8/AlmaLinux/RockyLinux**:

```bash
sudo dnf -y install mariadb postgresql && sudo dnf clean all
```

Install database clients on **Debian**:

```bash
sudo apt install mariadb-client postgresql-client
```

### Docker

Install **Docker** on **CentOS 7**:

```bash
sudo yum -y install docker && sudo yum clean all
sudo systemctl enable docker
sudo systemctl start docker
```

Install **Docker** on **CentOS 8/AlmaLinux/RockyLinux**:

```bash
sudo dnf -y install 'dnf-command(config-manager)'
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf -y install docker-ce && sudo dnf clean all
sudo docker --version
sudo systemctl enable docker
sudo systemctl start docker
```

Install **Docker** on **Debian**:

```bash
sudo apt update && sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
sudo apt update && sudo apt install docker-ce
sudo docker --version
sudo systemctl status docker
```

> **Note**:
> By default Docker is allowed to change the firewall rules to open exposed ports. 
> To disable this default behavior you need to edit `/usr/lib/systemd/system/docker.service` cartridge file
> and add `--iptables=false` (or similar if using `nftables`) to the `ExecStart` command.

Sign-in to **our private Docker registry**:

```bash
sudo docker login https://registry.simplicite.io
```

> **Note**:
> The images' prefix is `registry.simplicite.io/` (e.g. `registry.simplicite.io/platform:5-x`).

To test if everything works fine you can try starting a Tomcat-only ephemeral container with:

```bash
sudo docker run -it --rm -p 80:8080 registry.simplicite.io/server:<tag>
```

Where `<tag>` is one of the available tags. E.g. `6-latest` = `6` or `5-latest` = `5`, etc.

### Docker compose

Install the **Docker compose** tool on **CentOS 7**:

```bash
sudo yum -y install epel-release && sudo yum -y install docker-compose && sudo yum clean all
```

Install the **Docker compose** tool on **CentOS 8/AlmaLinux/RockyLinux** or **Debian**:

Check the latest `X.Y.Z` version on [GitHub](https://github.com/docker/compose/releases/latest).

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/vX.Y.Z/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose
sudo chmod +x /usr/bin/docker-compose
sudo docker-compose --version
```

<h2 id="descriptors">Docker compose descriptors</h2>

The sample `docker-compose.yml` files below are using different databases.

Create a folder for your instance (e.g. `myinstance`), all following files must be created in this folder.

> **Note**: Alternatively you can add `--project-name=myinstance` to all `docker-compose` command invokations.

<h3 id="hsqldb">Embedded HSQL database (1 container)</h3>

```yaml
version: "3"
services:
  simplicite:
    image: registry.simplicite.io/platform:<tag>
    restart: unless-stopped
    container_name: myinstance-hsqldb
    ports:
      - 80:8080
    volumes:
      - myinstance-hsqldb-db:/usr/local/tomcat/webapps/ROOT/WEB-INF/db
      - myinstance-hsqldb-dbdoc:/usr/local/tomcat/webapps/ROOT/WEB-INF/dbdoc
      - myinstance-hsqldb-git:/usr/local/tomcat/webapps/ROOT/WEB-INF/git
volumes:
  myinstance-hsqldb-db:
  myinstance-hsqldb-dbdoc:
  myinstance-hsqldb-git:
```

> **Warning**: if you are planning to use a reverse proxy and/or to expose simplicite in HTTPS, make sure you use the apppropriate port mapping and configuration
> see [this document](/docs/documentation/operation/docker#ports) for more details.

<h3 id="mysql">MySQL database (2 containers)</h3>

```yaml
version: "3"
services:
  db:
    image: mysql:latest
    restart: unless-stoped
    container_name: myinstance-mysql-database
    command: --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: "simplicite"
      MYSQL_DATABASE: "simplicite"
      MYSQL_USER: "simplicite"
      MYSQL_PASSWORD: "simplicite"
    # ZZZ Uncomment these 2 lines only if you want to access to the database from the host machine ZZZ
    #ports:
    #  - 127.0.0.1:3306:3306
    volumes:
      - myinstance-mysql-db:/var/lib/mysql
  simplicite:
    image: registry.simplicite.io/platform:<tag>
    restart: unless-stopped
    container_name: myinstance-mysql-webapp
    environment:
      DB_SETUP: "true"
      DB_VENDOR: "mysql"
      DB_HOST: db
      DB_USER: "simplicite"
      DB_PASSWORD: "simplicite"
      DB_NAME: "simplicite"
      DB_WAIT: 10
    ports:
      - 80:8080
    volumes:
      - myinstance-mysql-git:/usr/local/tomcat/webapps/ROOT/WEB-INF/git
    depends_on:
      - db
volumes:
  myinstance-mysql-db:
  myinstance-mysql-git:
```

> **Note**: that the `DB_HOST` environment variable of the `simplicite` is using the name of the `db` service as hostname.

> **Warning**: if you are planning to use a reverse proxy and/or to expose simplicite in HTTPS, make sure you use the apppropriate port mapping and configuration
> see [this document](/docs/documentation/operation/docker#ports) for more details.

<h3 id="postgresql">PostgreSQL database (2 containers)</h3>

```yaml
version: "3"
services:
  db:
    image: postgres:latest
    restart: unless-stopped
    container_name: myinstance-postgres-database
    environment:
      POSTGRES_USER: "simplicite"
      POSTGRES_PASSWORD: "simplicite"
      POSTGRES_DB: "simplicite"
    # ZZZ Uncomment these 2 lines only if you want to access to the database from the host machine ZZZ
    #ports:
    #  - 127.0.0.1:5432:5432
    volumes:
      - myinstance-postgres-db:/var/lib/postgresql/data
  simplicite:
    image: platform:<tag>
    restart: unless-stopped
    container_name: myinstance-postgres-webapp
    environment:
      DB_SETUP: "true"
      DB_VENDOR: "postgresql"
      DB_HOST: db
      DB_USER: "simplicite"
      DB_PASSWORD: "simplicite"
      DB_NAME: "simplicite"
      DB_WAIT: 10
    ports:
      - 80:8080
    volumes:
      - myinstance-postgres-git:/usr/local/tomcat/webapps/ROOT/WEB-INF/git
    depends_on:
      - db
volumes:
  myinstance-postgres-db:
  myinstance-postgres-git:
```

> **Note**: that the `DB_HOST` environment variable of the `simplicite` is using the name of the `db` service as hostname.

> **Warning**: if you are planning to use a reverse proxy and/or to expose simplicite in HTTPS, make sure you use the apppropriate port mapping and configuration
> see [this document](/docs/documentation/operation/docker#ports) for more details.

<h3 id="oracle_mssqsl">Oracle or SQLServer database</h3>

For Oracle/SQLServer databases you need to build a **custom** Docker image in which you add the **appropriate** Oracle/SQLServer client and JDBC driver
(for these two databases these components are not redistribuables and **must** correspond to the database server version you are using).

Check [this GitHub repository](https://github.com/simplicitesoftware/docker) for examples.

<h2 id="manage">Start/stop/upgrade</h2>

To start the container(s):

```bash
sudo docker-compose up [-d]
```

To stop the container(s):

```bash
sudo docker-compose down
```

To update the images (after stopping the containers(s)):

```bash
sudo docker-compose pull
```

<h2 id="nginx">Optional: Add an SSL-enabled NGINX reverse proxy</h2>

To add an NGINX reverse proxy to expose your instances **over SSL** do the following changes
to the `docker-compose.yml` file:

```yaml
services:
(...)
  nginx:
    image: nginx:latest
    restart: unless-stopped
    container_name: myinstance-reverseproxy
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./server.crt:/etc/ssl/server.crt
      - ./server.key:/etc/ssl/server.key
(...)
```

And, of course, remove the exposed `80` port from the `simplicite` and expose the `8443` **locally** olny
(i.e. remove the `-80:8080` and add `- 127.0.0.1:8443:8443` in the `ports` section of your deployment descriptors).

> **Warning**: As explained in [this document](/docs/documentation/operation/docker#ports) the `8080` port is for an **HTTP** enpoint of the reverse proxy
> and the `8443` port is for an **HTTPS** endpoint of the reverse proxy.
> If you don't use the right port for the right usage (typically if you misuse the `8080` for an HTTPS endpoint of the reverse proxy) it **will** result in unexpected behaviors

Where `nginx.conf` is like:

```nginx
events {
}
http {
    gzip on;
    gzip_types text/plain text/css text/javascript text/xml application/json application/javascript application/x-javascript;
    server_names_hash_bucket_size 128;
    client_max_body_size 0;

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;

        location / {
            return 301 https://$http_host$request_uri;
        }
    }

    server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name  _;

        ssl_certificate "/etc/ssl/server.crt";
        ssl_certificate_key "/etc/ssl/server.key";

        location / {
            # Uncomment this block if you need to enable CORS
            #if ($request_method = 'OPTIONS') {
            #    add_header Access-Control-Allow-Origin $http_origin;
            #    add_header Access-Control-Allow-Credentials true;
            #    add_header Access-Control-Allow-Headers Content-Type,Authorization,X-Requested-With,X-HTTP-Method-Override,X-Simplicite-Authorization;
            #    add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,HEAD,OPTIONS;
            #    add_header Access-Control-Max-Age 1728000;
            #    add_header Content-Type text/plain;
            #    add_header Content-Length 0;
            #    return 204;
            #}
            if ($request_method ~ '(GET|POST)') {
            #    Uncomment these 3 lines if you need to enable CORS
            #    add_header Access-Control-Allow-Origin $http_origin always;
            #    add_header Access-Control-Allow-Credentials true always;
            #    Uncomment these 3 lines if you need to enable CSP and other security directives (make sure to add specific directives for external services your application may use e.g. Google Maps, ..)
            #    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:" always;
            #    add_header X-Frame-Options SAMEORIGIN always;
            #    add_header X-XSS-Protection "1; mode=block" always;
            }
            proxy_redirect off;
            proxy_buffering off;
            proxy_read_timeout 86400s;
            proxy_send_timeout 86400s;
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_pass http://simplicite:8443;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

> **Note**: that the `proxy_pass` statement is using the name of the `simplicite` service as hostname
> and the secured `8443` port (not the unsecured `8080` port) as explained above using the right port here is **mandatory** to avoid unexpected behaviors

The mapped `/etc/sslserver.crt` and `/etc/sslserver.key` are the SSL certificate and corresponding key
that you have obtained/bought for your hostname(s).

<h3 id="gzip">GZIP compression</h3>

In all cases you **should** configure GZIP compression. Depending on your deployment strategy it can be done at different level.

- it can be done directly by the Tomcat of the Simplicité container using the `GZIP=true` environment variable.
- it can be done (and in most case it is preferrable) at the reverse proxy level
  (see, for instance, the `gzip on;` statement in the above NGINX configuration file)

<h3 id="websockets">Websockets</h3>

Websockets-based features (such as pushing servers logs to the browser's console) can be totally **inhibited** using the `WEBSOCKETS=false`.
This may be required on some networks (e.g. with old proxies) where websockets are filtered or forced closed after a given timeout.
 
<h3 id="compiler">Java compiler</h3>

The Java compiler can be totally **inhibited** using the `COMPILER=false`.
This may be required in some particular cases (e.g. security reasons).

Note that this means that any Java compiled class must be provided otherwise, e.g. by mounting/copying externally built JARs in the `WEB-INF/lib` of the webapp.
 
<h3 id="selfsigned-certificate">Generate a self-signed certificate</h3>

You can generate them as a **self-signed** certficate with the following commands:

```bash
openssl genrsa -des3 -out server.key 4096
openssl req -new -key server.key -out server.csr
cp server.key server-pwd.key
openssl rsa -in server-pwd.key -out server.key
openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt
```

> **Note**: a self-signed certificate will generate warnings in your browser

<h3 id="letsencrypt-certificate">Use a LetsEncrypt certificate</h3>

You can obtain a free **signed** certificate from the **LetsEncrypt** service, there are some steps to go thru:

1) Add this to the HTTP server config in `nginx.conf` (before the `location / {...}` block):

```nginx
(...)
        location ^~ /.well-known/acme-challenge/ {
            root /usr/local/tomcat/webapps/ROOT;
        }
(...)
```

2) Comment the HTTPS config in the `nginx.conf` file.

3) Create a `.well-known` dir:

```bash
mkdir .well-known
```

4) Add a new volume mapping to the `simplicite` service in the `docker-compose.yml` file:

```yaml
(...)
      - ./.well-known:/usr/local/tomcat/webapps/ROOT/.well-known
(...)
```

5) Restart

6) Request the LetEncrypt certificate by:

```bash
sudo certbot certonly --webroot -w . -d <myhostname>
```

7) Uncomment the HTTPS config  in the `nginx.conf` file.

8) Change the certificat and key volume mappings in the `docker-compose.yml` file to:

```yaml
(...)
      - /etc/letsencrypt/live/<myhostname>/fullchain.pem:/etc/ssl/server.crt
      - /etc/letsencrypt/live/<myhostname>/privkey.pem:/etc/ssl/server.key
(...)
```

9) Restart.

> **Note**: the above step are not required when you renew the certificate by `sudo certbot renew`.

<h2 id="connecting">Connecting to a running container</h2>

List the running containers with:

```bash
sudo docker ps
```

Look for the container ID or name of the Simplicité container and execute a bash shell into this container:

```bash
sudo docker exec -it <container ID or name> bash
```

Inside the container the Tomcat base folder is `/usr/local/tomcat`.

<h2 id="logs">Reviewing logs of a running container</h2>

List the running containers with:

```bash
sudo docker ps
```

Look for the container ID or name of the Simplicité container and execute standard Docker logs commands such as:

```bash
sudo docker logs -f <container ID or name>
```

<h2 id="licensekey">Deploying wih a license key</h2>

See [Auto Setup](/docs/documentation/operation/auto-setup)

<h2 id="modules">Deploying with business modules</h2>

See [Auto Setup](/docs/documentation/operation/auto-setup)
