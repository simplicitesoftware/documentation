---
sidebar_position: 10
title: Docker quickstart
---

Docker quickstart
=================

Prerequisites
-------------

- have Docker installed and running
- have the credentials to login to Simplicité's private Docker images registry

Start an instance
-----------------

1. login to the registry

   ```bash
   docker login registry.simplicite.io
   ```

2. start a **development** instance with an embedded database:

   ```bash
   docker run \
     -p 8080:8080 \
     -e DEV_MODE=true \
     -v db:/usr/local/tomcat/webapps/ROOT/WEB-INF/db \
     -v dbdoc:/usr/local/tomcat/webapps/ROOT/WEB-INF/dbdoc \
     registry.simplicite.io/platform:6-latest
   ```

   or the same with the compose plugin:

   ```bash
   cat << EOF > docker-compose.yml
   services:
     simplicite:
       image: registry.simplicite.io/platform:6-latest
       ports:
         - 8080:8080
       volumes:
         - db:/usr/local/tomcat/webapps/ROOT/WEB-INF/db
         - dbdoc:/usr/local/tomcat/webapps/ROOT/WEB-INF/dbdoc
       environment:
         DEV_MODE: "true"
   volumes:
     db:
     dbdoc:
   EOF
   docker compose up
   ```

   The instance's UI is then available on [http://localhost:8080](http://localhost:8080) (user/password = `designer`/`simplicite`).
