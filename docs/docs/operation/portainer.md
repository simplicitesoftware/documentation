---
sidebar_position: 25
title: Portainer
---

Simplicité with Portainer & Traefik
====================================

Portainer is a container management platform that enables efficient deployment and operation of Docker containers.
This document demonstrates how to use Portainer to deploy Simplicité instances with automated configuration and management.

- **minimal manual configuration**
- SSL certificates auto-setup with Let's Encrypt
- HTTP -> HTTPS redirection
- Traefik's reverse proxy dashboard activated and available at `traefik.my.domain` behind `admin / _ChangeItNow_` default basic auth
  (can be changed using `htpasswd -bn your_user_name your_super_complex_password | sed 's/\$/$$/g'`, doubling the `$` is required)
- Portainer available at `portainer.my.domain`
- allow remote debugging

![Portainer](img/portainer/portainer.png)

1 - Server deployment
---------------------

Sizing of the server should be made according to the needs, as always. Any up-to-date unix image should be able to run the containers.

<details>
<summary>Click to open</summary>

- Medium-sized server :
  - 2 vCores
  - 50GiB storage
  - 250Mbps bandwidth
- Almalinux 9 image

</details>

2 - System configuration
------------------------

### Firewall

Installing a local firewall is **highly recommended**, for instance by issuing the following commands:

```bash
sudo dnf -y install firewalld && sudo dnf clean all
sudo systemctl enable firewalld
sudo systemctl start firewalld
```

Configuration: here it allows HTTP(S) and SSH traffic from any source:

```bash
sudo firewall-cmd --add-service=ssh --permanent
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --remove-service=cockpit --permanent
sudo firewall-cmd --reload
```

Verify the configuration:

```bash
sudo firewall-cmd --list-all
```

### System time

Adjust the system date and timezone to your nee, e.g.

```bash
sudo timedatectl set-timezone Europe/Paris
```

### SSH connection method

It is **highly recommended** to allow only SSH connections using SSH keys
(remember to disable password authentication after having configured the allowed SSH keys)

### System updates

The system **must** be up-to-date **before proceeding**:

```bash
sudo dnf update -y
```

:::info

The system **must** be kept up-to-date by either executing the above command regularly, or by setting up automatic updates. If you activate
automatic reboot, make sur you have some kind of VM backup setup.

```bash
sudo dnf install dnf-automatic -y
sudo sed -i 's/^reboot=.*/reboot=when-needed/' /etc/dnf/automatic.conf
sudo systemctl edit --full dnf-automatic.timer
sudo systemctl enable --now dnf-automatic.timer
```

If there are any problems with automatic updates, logs should be available through `sudo journalctl -u dnf-automatic.service`

:::

3 - Docker Install
------------------

Portainer needs Docker as a requirement, so it will be installed after usual upgrades. Based on [docker CentOS install docs](https://docs.docker.com/engine/install/centos/) (adapted)

```sh
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker almalinux # add your current user to docker group
exit # we need to exit and log back in for the docker group to take effect
docker run hello-world # check everything is running smoothly
```

Portainer also needs SELinux to be disabled:

```sh
sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
sudo reboot
```

:::note
Optionally a firewall should be configured on the host (or among the host) to allow only the relevant traffic.
Minimal configuration is to allow the HTTP port `80` and HTTPS port `443` (along with the SSH port `22` from legitimate origins) through this firewall.
:::

4 - Portainer install with lets encrypt and traefik
---------------------------------------------------

This is an adaptation of Portainer's doc "[Deploying Portainer behind Traefik Proxy](https://docs.portainer.io/advanced/reverse-proxy/traefik)"

1. create a local `acme.json` with `600` rights **prior** to starting this Docker compose configuration
2. copy, adapt, and paste the following configuration at the home of your user
3. start the configured services with `sudo docker compose up -d`
4. verify that you have access to `traefik.my.domain` and `portainer.my.domain`

:::warning
**Do not** use the following configuration as is, make sure to adapt all lines that are marked `ADAPT` in the configuration.
:::

:::tip
To generate the basic auth user / pwd, you can use the following command line (doubling the `$` is required)

```bash
htpasswd -bn your_user_name your_super_complex_password | sed 's/\$/$$/g'
```

:::

<details>
<summary>See config</summary>

```yaml
services:
  traefik:
    container_name: traefik
    image: "traefik:latest"
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    networks:
      - proxy
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./acme.json:/acme.json"
    command:
      - --api.insecure=true
      - --api.dashboard=true # ADAPT to deactivate Traefik dashboard
      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entryPoints.web.http.redirections.entrypoint.scheme=https
      - --entrypoints.websecure.address=:443
      - --entrypoints.websecure.asdefault=true
      - --log.level=INFO
      - --accesslog=true
      - --providers.docker
      - --providers.docker.network=proxy
      - --providers.docker.exposedByDefault=false
      - --certificatesresolvers.leresolver.acme.httpchallenge=true
      - --certificatesresolvers.leresolver.acme.email=mail@my.domain # ADAPT email for the generation of SSL certificates with Let's Encrypt.
      - --certificatesresolvers.leresolver.acme.storage=./acme.json
      - --certificatesresolvers.leresolver.acme.httpchallenge.entrypoint=web
    labels:
      - traefik.enable=true
      - traefik.http.routers.mydashboard.rule=Host(`traefik.my.domain`) # ADAPT domain name
      - traefik.http.routers.mydashboard.tls.certresolver=leresolver
      - traefik.http.routers.mydashboard.entrypoints=websecure
      - traefik.http.routers.mydashboard.service=api@internal
      - traefik.http.routers.mydashboard.middlewares=myauth
      - traefik.http.middlewares.myauth.basicauth.users=admin:$$apr1$$HQ4CZZxC$$kUrQ6qAFrX4v/EAYFdrsh1 # ADAPT basic auth
  portainer:
    image: portainer/portainer-ce:latest
    command: -H unix:///var/run/docker.sock
    restart: unless-stopped
    networks:
      - proxy
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    labels:
      # Frontend
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`portainer.my.domain`)" # ADAPT domain name
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.services.frontend.loadbalancer.server.port=9000"
      - "traefik.http.routers.frontend.service=frontend"
      - "traefik.http.routers.frontend.tls.certresolver=leresolver"
      # Edge
      - "traefik.http.routers.edge.rule=Host(`edge.my.domain`)" # ADAPT domain name
      - "traefik.http.routers.edge.entrypoints=websecure"
      - "traefik.http.services.edge.loadbalancer.server.port=8000"
      - "traefik.http.routers.edge.service=edge"
      - "traefik.http.routers.edge.tls.certresolver=leresolver"
networks:
  proxy:
    name: proxy
volumes:
  portainer_data:
```

</details>

:::info
The Traefik container and the Simplicité instances have to run in the same Docker network, that's why a "proxy" network
is created where all containers will be placed.
:::

5 - Configure
-------------

- access `https://portainer.my.domain` **right after starting the service** (it's only configurable for a limited amount of time)
- create local environment
- create registry.simplicite.io registry, with authentication
- pull a Simplicité image

6 - Start a Simplicité instance
-------------------------------

This is the minimal configuration to get a working Simplicité (non persistent) instance. Create a "stack"
(a docker compose deployment, in Portainer's semantics), and paste the following config.

```yaml
services:
  test:
    image: registry.simplicite.io/platform:6-latest-light
    restart: unless-stopped
    container_name: test
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.test.rule=Host(`test.my.domain`)"
      - "traefik.http.routers.test.entrypoints=websecure"
      - "traefik.http.routers.test.tls.certresolver=leresolver"
      - "traefik.http.services.test.loadbalancer.server.port=8443"
networks:
  proxy:
    name: proxy
```

To make it persistent add the following volumes to the above configuration:

```yaml
services:
  test:
    (...)
    volumes:
      - db:/usr/local/tomcat/webapps/ROOT/WEB-INF/db
      - dbdoc:/usr/local/tomcat/webapps/ROOT/WEB-INF/dbdoc
      - git:/usr/local/tomcat/webapps/ROOT/WEB-INF/git
(...)
volumes:
  db:
  dbdoc:
  git:
```

To enable JPDA remote debugging add the following environment variables and open an access to port `8000`. Assign a different port to each instance (8001, 8002, 8003...).

```yaml
services:
  test:
    (...)
    ports:
      - 8001:8000 # expose port 8000
    environment:
      (...)
      JPDA: "true"
      JPDA_SUSPEND: "<y|n, defaults to n>" # true to wait for debugger
    (...)
```

To use [developer mode](/docs/docs/operation/docker.md#developer-mode) for development-oriented features and
for the [Simplicité VSCode tools extension](/docs/docs/devops/external-editor.md#simplicité-extension),
add the following `DEV_MODE` environment variable.

```yaml
services:
  test:
    (...)
    environment:
      (...)
      DEV_MODE: true
      (...)
```

7 - Configure stack templates
-----------------------------

You can also configure Portainer to use our stack templates, to do so change the _App Templates_ URL in the settings
using this URL: `https://cdn.jsdelivr.net/gh/simplicitesoftware/resources@latest/public/portainer_templates/templates.json`

![templates](img/portainer/templates.png)

Or manually configure custom templates using the `*.yml` present at [this location](https://cdn.jsdelivr.net/gh/simplicitesoftware/resources@latest/public/portainer_templates/).

Backup an instance
------------------

This script makes the assumption that you have deployed with portainer a stack that with an app service (Simplicité)
and a database service (PostgreSQL). You can call it daily and setup rotating backups.

Each backed up project uses a variables-definitions `backup-myproject.sh` script that call a unified `backup.sh` script.
`backup-myproject.sh` should be called by cron (`crontab -e`).

<details>
<summary>Click to see scripts</summary>

`backup-myproject.sh` script:

```bash
#!/bin/bash
set -euo pipefail

### PROJECT VARIABLES

BACKUP_ROOT="/home/almalinux/backups"

# --- portainer stack info
COMPOSE_PROJECT="xxx"
APP_SERVICE="xxx"
APP_DBDOC_VOLUME="xxx"
PSQL_SERVICE="xxx"
PSQL_DBNAME="xxx"
PSQL_DBUSER="xxx"

# --- Minimum free space required
THRESHOLD_GB=20
MOUNTPOINT="/"
MAIL_TO="xxx"

{
    echo "===== Backup run $(date) ====="
    source "$(dirname "$0")/backup.sh"
    # optionally, send $TGZ to an object storage
    echo "===== Done ====="
} 2>&1 | tee -a "$BACKUP_ROOT/backup-$COMPOSE_PROJECT.log"
```

`backup.sh` script:

```bash
#!/bin/bash

set -euo pipefail

echo "🤖 Running backup.sh"

# --- Required variables ---
REQUIRED_VARS=(
    BACKUP_ROOT
    COMPOSE_PROJECT
    APP_SERVICE
    APP_DBDOC_VOLUME
    PSQL_SERVICE
    PSQL_DBNAME
    PSQL_DBUSER
    THRESHOLD_GB
    MOUNTPOINT
    MAIL_TO
)

MISSING=()
for VAR in "${REQUIRED_VARS[@]}"; do
    # The “-” avoids unbound variable errors under `set -u`
    if [[ -z "${!VAR-}" ]]; then
        MISSING+=("$VAR")
    fi
done

if (( ${#MISSING[@]} > 0 )); then
    echo "❌ Error: the following required variables are not set or empty:"
    for VAR in "${MISSING[@]}"; do
        echo "  - $VAR"
    done
    echo "Please check your configuration script before running backup.sh."
    exit 1
fi

echo "ℹ️  All required variables are defined."


# --- Get available space in GB (integer) ---
AVAILABLE_GB=$(df -BG --output=avail "$MOUNTPOINT" | tail -1 | tr -dc '0-9')

# --- Check threshold ---
if (( AVAILABLE_GB < THRESHOLD_GB )); then
    {
        echo "⚠️  Low disk space alert on $(hostname)"
        echo "Mount point: $MOUNTPOINT"
        echo "Available: ${AVAILABLE_GB}GB"
        echo "Required:  ${THRESHOLD_GB}GB minimum"
        echo "Date: $(date)"
    } > "$TMP_LOG"

    # Send email (requires mailutils / postfix / sendmail configured)
    mail -s "[ALERT] Low disk space on $(hostname)" "$MAIL_TO" < "/tmp/disk_space_check.log"

    echo "ℹ️  ALERT sent: only ${AVAILABLE_GB}GB left on $MOUNTPOINT"
    exit 1
else
    echo "ℹ️  Disk space OK: ${AVAILABLE_GB}GB available on $MOUNTPOINT"
fi


# === CONFIG & PREP ===
BACKUPNAME="${COMPOSE_PROJECT}-$(date +%Y-%m-%d_%H-%M).bak"
BACKUPDIR="${BACKUP_ROOT}/${BACKUPNAME}"
TGZ="${BACKUPNAME}.tgz"

mkdir -p "$BACKUPDIR"

echo "ℹ️  Starting backup for project: $COMPOSE_PROJECT"

# === STOP SERVICE ===
echo "ℹ️  Stopping service: $APP_SERVICE"
sudo docker compose -p "$COMPOSE_PROJECT" stop "$APP_SERVICE"

# === DATABASE DUMP ===
echo "ℹ️  Creating database dump..."
sudo docker compose -p "$COMPOSE_PROJECT" exec -T "$PSQL_SERVICE" \
  sh -c "pg_dump -U \"$PSQL_DBUSER\" \"$PSQL_DBNAME\" > /var/lib/backup/database.dump"

sudo docker compose -p "$COMPOSE_PROJECT" cp \
  "$PSQL_SERVICE:/var/lib/backup/database.dump" "$BACKUPDIR/database.dump"

# === DBDOC VOLUME COPY ===
echo "ℹ️  Backing up dbdoc volume..."
sudo docker run -v "$APP_DBDOC_VOLUME:/data" --name helper busybox true
sudo docker cp helper:/data "$BACKUPDIR/dbdoc" || true
sudo docker rm -f helper 2>/dev/null || true
sudo chown -R $USER:$USER "$BACKUPDIR"

# === RESTART SERVICE ===
echo "ℹ️  Restarting service: $APP_SERVICE"
sudo docker compose -p "$COMPOSE_PROJECT" start "$APP_SERVICE"

# === CREATE ARCHIVE ===
echo "ℹ️  Creating archive..."
cd "$BACKUP_ROOT"
tar -czf "$TGZ" "$BACKUPNAME"
rm -rf "$BACKUPNAME"

echo "✅ Backup completed successfully: $TGZ"
```

</details>
