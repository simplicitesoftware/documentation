---
sidebar_position: 200
title: CI/CD
unlisted: true
---

sCI/CD
=====

**Objectives:** demonstrate initialization of a Simplicité module and setup of a Continuous Integration pipeline, with:

- **JUnit** unit tests check
- **Jacoco** unit tests code coverage
- **Sonar** code quality check

This document focuses on an example based on a **Gitlab + Portainer** infrastructure,
but is easily portable to other code versioning and orchestration tools (Github, Kubernetes, SIM, etc.).

Prerequisites
--------------

:::info
SonarQube Cloud does **not** support linking an organization to more than one DevOps platform at a time.
If the user's mail is already part of a Sonarcloud organization linked to GitHub, then Github should be used instead of Gitlab.
Alternatives include deploying a SonarQube instance, using another code analyzer, etc.
:::

- a Portainer instance with access to Simplicité images
- git installed locally
- a gitlab.com account, configured for access from local repositories
- a sonarcloud account

1- Versionning
-----------------

This section initializes the project, setting up a developpement instance and the gitlab repo

### Gitlab

1. create blank public project/repository
2. copy repository URL

### Simplicité

1. deploy a developpement Simplicité instance from Portainer `myapp-dev.my.domain`
2. create an empty module, and configure the settings field like specified below
3. create an init commit (prefer json exploded export type)
4. copy repository URL

```json
{
	"type": "git",
	"origin": {
		"uri": "https://gitlab.com/simplicite-gitlab-group/module-myapp"
	}
}
```

### Local repository

Clone the Simplicité repo and push it to gitlab:

```shell
git clone https://myapp-dev.atelier.simplicite.io/git/MyApp
cd MyApp
git remote add gitlab https://gitlab.com/simplicite-gitlab-group/module-myapp
git push -u gitlab master
```

2- Deploy test instance
-----------------------

For most of the steps of the CICD, a clean slate with Simplicité and the app's configuration is needed.
The DevOps platform (Gitlab, Github, etc), thus needs to instruct an orchestrator to deploy just that.
A set of CLI tools interacting with portainer allows to do various operations on the CLI.
Let's install the tools, test them locally, then configure the devops platform to deploy a test instance at each commit.

### Simplicité CI Tooling

Download the [Simplicite CI tooling](https://github.com/simplicitesoftware/simci) in the `./others` directory of the server:

```shell
mkdir others
cd others
curl -o myapp-compose.yml https://raw.githubusercontent.com/simplicitesoftware/resources/refs/heads/master/public/portainer_templates/demo-tmp.yml
curl -O https://raw.githubusercontent.com/simplicitesoftware/simci/refs/heads/main/simci
chmod +x simci
```

Adapt the docker compose file (`myapp-compose.yml`) to the project's values. For a blank project, it should mainly be the importspec:

```yaml
[...]
MODULES_IMPORT_SPEC: |
  title: "${COMPOSE_PROJECT_NAME}"
  modules:
    - name: "MyApp"
      git: 
        uri: "https://gitlab.com/simplicite-gitlab-group/module-myapp"
[...]
```

Create a `.env` file with the correct values for local testing:

```shell
IO_PASSWORD="change-me"
PORTAINER_SERVER="top-domain"
PORTAINER_API_TOKEN="get-the-token-in-portainer"
STACK_NAME="test-simci"
```

Create and run an executable `test-simci.sh` file

```shell
#!/bin/bash

set -a
source .env
set +a

./simci portainer-stack-deploy -f myapp-compose.yml $STACK_NAME $PORTAINER_SERVER
```

You should get some information in return, and after a while, a "healthy container" message in the CLI.

Connect to the app and check that the module was correctly pre-installed:

![test cli](./img/cicd/test-simci.png)

:::warning
If any of the following apply, investigate before going any further:

- the instance is not accessible at the expected URL
- the module is not pre-installed, with the init commit effectively present
- HTTPS is not functional

:::

Now that the tooling is properly installed and functional, let's commit the changes:

```shell
git commit etc etc
```

### Gitlab pipeline

Create `.gitlab-ci.yml` with a simple "build" stage and a single "deploy-test job":

```yaml
stages:
  - build

deploy-test:
  stage: build
  script:
    - export PORTAINER_API_TOKEN="${PORTAINER_API_TOKEN}"
    - export IO_PASSWORD="${IO_PASSWORD}"
    - ./others/sim-cicd/simci portainer-stack-delete gitlab-test-myapp $PORTAINER_URL
    - ./others/sim-cicd/simci portainer-stack-deploy -f ./others/myapp-compose.yml gitlab-test-myapp $PORTAINER_URL
```

In Gitlab (Project > Settings > CI/CD > CI/CD Variables), set the corresponding variables for the project (they should have the values used in the `.env`)

![Gitlab vars](./img/cicd/gitlab-vars.png)

Finally, commit, push to gitlab (and you dev instance which is now behind), and check that the pipeline runs and deploys the test instance properly.

2- Unit tests
--------------

### Simplicité

1. add a unit tests shared code in the module
2. commit & pull changes locally

#### Maven configuration setup

Adapt the following json:

- with the correct `maven.repositoryUrl` based on your Simplicité version (check [simplicité's maven repositories](https://docs.simplicite.io/versions))
- with the correct `origin.uri` based on Gitlab's repo URL

----

```json
{
	"maven": {
		"eslint": true,
		"stylelint": true,
		"jshint": true,
		"checkstyle": true,
		"repositoryUrl": "https://platform.simplicite.io/<simplicite-version>/maven"
	},
	"origin": {
		"uri": "https://gitlab.com/simplicite-software/module-myapp2.git"
	},
	"type": "git",
	"sonar": {
		"projectKey": "module-simfeatures",
		"organization": "simplicite-software-gitlab",
		"host.url": "https://sonarcloud.io",
		"coverage.exclusions": "resources/**.js"
	}
}
```
