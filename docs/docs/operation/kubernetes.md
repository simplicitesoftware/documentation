---
sidebar_position: 20
title: Kubernetes
---

Simplicité on Kubernetes
===============================

> **Warning**: This document is a work in progress DRAFT

Prerequisites
-------------

Configure a Kubernetes cluster and at least a worker.

Install the [Kubernetes CLI](https://kubernetes.io/tasks/tools/install-kubectl/) on the client machine.
And configure it in `$HOME/.kube/config`.

Preflight checks
----------------

Verify the configuration:

```text
kubectl config view
kubectl config get-contexts
```

If you have several clusters:

```text
kubectl config use-context <cluster name>
```

Verify the cluster:

```text
kubectl cluster-info
kubectl cluster-info dump
```

Allow use of private images
---------------------------

The Simplicité images needs appropriate credentials on DockerHub.

First sign in to DockerHub with your DockerHub account:

```text
docker login
```

Then create a secret from the created `$HOME/.docker/config.json` file by:

```text
kubectl create secret generic regcred --from-file=.dockerconfigjson=$HOME/.docker/config.json --type=kubernetes.io/dockerconfigjson
```

Alternatively you can create the secret directly (without signin in to DockerHub) by:

```text
kubectl create secret docker-registry regcred --docker-server=https://index.docker.io/v1/ --docker-username=<your username> --docker-password=<your password> --docker-email=<your email address>
```

Basic Simplicité sandbox example using Kompose&reg;
---------------------------------------------------

For this basic example, the [Kompose tool](https:installation.md) will be used.

Provided the following Docker compose file `docker-compose.yml`:

```yaml
services:
  simplicite:
    image: registry.simplicite.io/platform:latest
    restart: always
    container_name: myapp
    ports:
     - 80:8080
    labels:
      kompose.service.type: LoadBalancer
```

Convert it using the Kompose tool:

```text
kompose convert -f docker-compose.yml
```

This creates 2 Kubernetes YAML files:

```text
simplicite-deployment.yaml
simplicite-service.yaml
```

In the `simplicite-deployment.yaml` add:

```yaml
      imagePullSecrets:
      - name: regcred
```

At the same level as the `containers` statement.

Deploy to cluster:

```text
kubectl apply -f simplicite-deployment.yaml -f simplicite-service.yaml
```

> **Note**: A simple `kompose up` does not work because of DockerHub credentials that needs to be added manually.
> This may change in the future...

Get the service information:

```text
kubectl get service simplicite
```

Which produces:

```text
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP                        PORT(S)        AGE
simplicite   LoadBalancer   10.3.119.175   6fvb57vqjk.lb.c4.gra.k8s.ovh.net   80:31083/TCP   17m
```

In the above case you can now point your browser to `http://6fvb57vqjk.lb.c4.gra.k8s.ovh.net`

> **Warning**: in this sandbox example there is no persistence at all, no data survives when the container is shut down.

Comprehensive example
---------------------

This example demonstrates the use of custom manifests to deploy a PostgreSQL database and a Simplicité instance.

### Database

The following `postgres.yml` manifest contains:

- A persistent volume for data
- A claim for the above persistent volume
- A deployment for a PostgreSQL database container
- A service for the PostgreSQL database

```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-data-volume
  labels:
    type: local
    app: postgres
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  hostPath:
    path: "/mnt/data"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data-claim
  labels:
    app: postgres
spec:
  volumeName: postgres-data-volume
  storageClassName: manual
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  labels:
    app: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:latest
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: simplicite
            - name: POSTGRES_USER
              value: simplicite
            - name: POSTGRES_PASSWORD
              value: simplicite
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: postgres-data
      volumes:
        - name: postgres-data
          persistentVolumeClaim:
            claimName: postgres-data-claim
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  labels:
    app: postgres
spec:
  type: NodePort
  ports:
    - port: 5432
  selector:
    app: postgres
```

To create it:

```text
kubectl create -f postgres.yml
```

Check service:

```text
kubectl get service postgres
```

Which produces something like:

```text
NAME       TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
postgres   NodePort   10.3.179.187   <none>        5432:31392/TCP   9m6s
```

### Simplicité instance

The following `simplicite.yml` manifest contains:

- A persistent volume for the Git repositories
- A claim for the above persistent volume
- A deployment for a Simplicité instance container
- A loadbalanced service for the Simplicité instance

```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: simplicite-git-volume
  labels:
    type: local
    app: simplicite
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  hostPath:
    path: "/mnt/git"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: simplicite-git-claim
  labels:
    app: simplicite
spec:
  volumeName: simplicite-git-volume
  storageClassName: manual
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: simplicite
  labels:
    app: simplicite
spec:
  replicas: 1
  selector:
    matchLabels:
      app: simplicite
  template:
    metadata:
      labels:
        app: simplicite
    spec:
      containers:
        - name: simplicite
          image: registry.simplicite.io/platform:latest
          ports:
            - containerPort: 8080
          env:
            - name: DB_HOST
              value: postgres
            - name: DB_NAME
              value: simplicite
            - name: DB_PASSWORD
              value: simplicite
            - name: DB_SETUP
              value: "true"
            - name: DB_USER
              value: simplicite
            - name: DB_VENDOR
              value: postgresql
            - name: DB_WAIT
              value: "100"
          volumeMounts:
            - mountPath: /usr/local/tomcat/webapps/ROOT/WEB-INF/git
              name: simplicite-git
      imagePullSecrets:
        - name: regcred
      volumes:
        - name: simplicite-git
          persistentVolumeClaim:
            claimName: simplicite-git-claim
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: simplicite
  name: simplicite
spec:
  type: LoadBalancer
  sessionAffinity: ClientIP
  ports:
    - port: 80
      targetPort: 8080
  selector:
    app: simplicite
status:
  loadBalancer: {}
```

To create it:

```text
kubectl create -f simplicite.yml
```

Check service:

```text
kubectl get service simplicite
```

Which produces something like:

```text
NAME         TYPE           CLUSTER-IP    EXTERNAL-IP                        PORT(S)        AGE
simplicite   LoadBalancer   10.3.77.200   6d9lguc0l0.lb.c4.gra.k8s.ovh.net   80:31816/TCP   17m
```

In the above case you can now point your browser to `http://6d9lguc0l0.lb.c4.gra.k8s.ovh.net`

> **Note**: in the above example there is only one replica for the Simplicité deployment, you can set it to more that one but note that
> the load balancing is done based on client IP address. If you need a better load balancing strategy
> (e.g. a session cookie-based sticky session load balancing)
> you need to configure an appropriate ingress (the configuration of such ingress is not specific to Simplicité, thus not described here)

Kubernetes dashboard
--------------------

If you have configured the Kubernetes Dashboard you can access it like this:

Generate an access token:

```text
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')
```

Start proxy to expose the dashboard on `http://localhost:8001`.

```text
kubectl proxy
```

Point your browser to [](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/) and sign in using the above token.
