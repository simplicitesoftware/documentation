---
sidebar_position: 150
title: Quality
---

Quality
=======

See [this document](/versions/versioning) for details on the platform's versioning strategies and the the [security guidelines](/docs/security) for more details on how to secure your deployments.

Dependencies
------------

### Dependencies upgrade policy

Except in case of a critical ("zero-day") vulnerability which may be actually exploited in the context of Simplicité,
the third party components are **only** upgraded on the `master` branch (development = alpha).

By default, the `prerelease` (beta) and `release` branches (and the legacy maintenance versions branches) keep their dependencies
**as they were** at the time the `master` branch was pushed on these branches.

On the `master` branch:

- The up-to date check is done at least once a week.
- All newer version of the components are upgraded as soon as they are available.
  However, in general, only the stable released components are upgraded, the unstable release candidate, beta or alpha versions of the components are ignored.

#### Java dependencies

The Java dependencies up-to-date check is done using Apache Maven and its [dependency plugin](http://maven.apache.org/plugins/maven-dependency-plugin/).

#### JavasScript dependencies

The JavaScript dependencies up-to-date check is done using the [npm check update tool](https://www.npmjs.com/package/npm-check-updates).

### Dependencies security audits

#### Java dependencies audit

As of version 4.0, a dependencies security audit using Apache Maven and its [dependency check plugin](https://jeremylong.github.io/DependencyCheck/dependency-check-maven/index.html).

It is done at each build of each version for each branch.

#### JavaScript dependencies audit

As of version 5, a dependencies security audit using the [npm audit tool](https://docs.npmjs.com/cli/v6/commands/npm-audit).

It is done at each build of each version for each branch.

Platform code quality
---------------------

### Linters

The code style is analysed at least at each `master` branch build using the following linters:

- **Java** using [Checkstyle](https://checkstyle.sourceforge.io)
- **JavaScript** using [ESLint](https://eslint.org)
- **styles** using [StyleLint](https://stylelint.io)

Any issue is fixed as soon as detected by the above tools.

### Code analysis

The whole code (Java, JavaScript and styles) is regularly checked using the [SonarQube](https://www.sonarqube.org/) code analysis and code security tool.

- Any new issues classified "bug" are resolved as soon as detected.
- Any new "security hotspot" are reviewed as soon as they are raised. 
- All issues classified as "blocker, critical or major vulnerability" are resolved as soon as possible.
- All other issues (classified "minor or info vulnerability" or "code smell") are looked after with lower priority.

The SonarQube analysis is done on the `master` branch at least prior to pushing it to the `prerelease` branch.

External audits
---------------

Various audits are done, by external consulting firms, on a regular basis to detect potential security breaches and other security-related issues

These audit can be done at several levels depending on the context:

- Intrusion tests
- Generic UI vulnerabilites detection (e.g. XSS, SQL injection, etc.)
- Technical platform security checks (e.g. Docker images vulnerabilities analysis)
- Etc.

The results of these audits are always taken into account with **highest priority**.

All fixes are transposed to all branches, including the long term maintenance branches.

Docker images
-------------

The "server" images `registry.simplicite.io/server`, from which the "platform" images `registry.simplicite.io/platform` are built, are rebuilt on a regular basis,
in general for each new platform revision, using the up-to-date official base images of various OS flavors (CentOS, AlmaLinux, Alpine Linux, ...).

The "platform" images `registry.simplicite.io/platform` are rebuilt each time a platform upgrade (revision, minor or major version) is made available on the considered branch.

See this [GitHub repository](https://github.com/simplicitesoftware/docker) for more details on the way the various variants of images are built.
