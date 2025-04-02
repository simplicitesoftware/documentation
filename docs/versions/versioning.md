---
sidebar_position: 5
title: Versioning
---

Versioning
===========

## Versions {#versions}

| **Version** | **Maintenance State**      | **Support type** | **Release date**                            | **Maintenance end date**                    | **Docker images tags**              | **Template branch** |
|-------------|----------------------------|------------------|---------------------------------------------|---------------------------------------------|-------------------------------------|---------------------|
| [6.3](/versions/release-notes/v6-3.md)      | 🚧 Alpha                   | Not applicable   | *<abbr title="To Be Determined">TBD</abbr>* | *<abbr title="To Be Determined">TBD</abbr>* | `6-alpha[-light]`                   | `6.3[-light]`       |
| [6.2](/versions/release-notes/v6-2.md)       | ✅ **Current release**     | Current          | Feb 10th, 2025                              | *<abbr title="To Be Determined">TBD</abbr>* | `6[-light]`, `6.2[-light]`, `6.2.x` | `6.2[-light]`       |
| [6.1](/versions/release-notes/v6-1.md) | ☑️ Maintained              | Short term (STS) | July 10th, 2024                             | May 11th, 2025                              | `6.1[-light]`, `6.1.x`              | `6.1[-light]`       |
| [6.0](/versions/release-notes/v6-0.md)       | ❌ Expired                 | Short term (STS) | January 31st, 2024                          | October 31th, 2024                          | `6.0[-light]`, `6.0.x`              | `6.0[-light]`       |
| [5.3](/versions/release-notes/v5-3.md)        | ☑️ Maintained              | Long-term (LTS)  | April 24th, 2023                            | January 31st, 2027                          | `5[-light]`, `5.3[-light]`, `5.3.x` | `5.3[-light]`       |
| [5.2](/versions/release-notes/v5-2.md)       | ❌ Expired                 | Short term (STS) | April 20th, 2022                            | September 30th, 2023                        | `5.2[-light]`, `5.2.x`              | `5.2[-light]`       |
| [5.1](/versions/release-notes/v5-1.md)        | ❌ Expired                 | Short term (STS) | September 1st, 2021                         | October 31st, 2022                          | `5.1[-light]`, `5.1.x`              | `5.1[-light]`       |
| [5.0](/versions/release-notes/v5-0.md)       | ❌ Expired                 | Short term (STS) | January 11th, 2021                          | September 30th, 2021                        | `5.0[-light]`, `5.0.x`              | `5.0[-light]`       |
| `4.0`       | ⛔ Outdated!               | Long-term (LTS)  | 2018                                        | January 15th, 2024                          | `4[-light]`, `4.0[-light]`          | `4.0[-light]`       |
| `3.x`       | ⛔ Outdated!               | Long-term (LTS)  | 2014 (for 3.0)                              | July 3rd, 2020

Some interchangeable terms:
- **Current release**: release, latest version, latest stable
- **Beta**: release candidate, pre-release, test version
- **Alpha**: master, development version, nightly build

The [platform site](https://platform.simplicite.io) contains generated technical docs for all versions:
- [JavaDoc](https://platform.simplicite.io/current/javadoc/) & [JSDoc](https://platform.simplicite.io/current/jsdoc/)
- Java & JS dependencies list
- CVE Audit report

The [compatibility page](/docs/compatibility) maintains a list of compatible options to chose from when running Simplicité: OS, Database, Browser, etc.

### Versioning strategy {#versioning}

Simplicité follows a flavour of **semantic versioning**.

A `major.minor.revision` (eg. `6.1.21`) numbering system is used where:
- the `major` number is incremented for **new features with major breaking changes**
- the `minor` number is incremented for **new features** without major breaking changes
- the `revision` number is incremented for **improvements and fixes without any breaking change**

Unreleased (alpha and beta) version's numbers can be subject to change if a major breaking changes are introduced in the platform
(for example, planned version `5.4` was never released as `5.4` but became version `6.0` instead).

### Maintenance strategy {#maintenance}

1. When a new minor version is released, the last minor version (n-1) gets a **Standard maintenance period (>= 3 months)**
2. When a new major version is released, the last minor version (n-1) gets a **Long Term Support (LTS) maintenance period (>= 3 years)**
3. Thus, some parameters of version `n` are definitively fixed once version `n+1` is released:
    - **support type**: if `n+1` becomes major, then `n` becomes LTS.
    - **maintenance end date**: depends on the release date of `n+1` and if it falls under the major/minor category

**NB:** Major breaking changes are anticipated way ahead on the roadmap, so when a new major version in the workings it is announced with plenty of time ahead.

> **Fixes associated to security risks are landed on all maintained versions as soon as possible**

> **Once a version is released, it only receives critical fixes**. There are exceptions to this rule for the latest release where easily backportable and backward-compatible features are sometimes included.

## Upgrade requirements {#upgrade}

Maintainers of a Simplicité application have the duty of keeping the platform up-to-date which is **at the very least on the last revision of a maintained version**.

Not upgrading the platform is associated to numerous risks:
- Security: due to known CVEs (bugs) on the platform or any of its dependencies
- Version freezing: usually, the more commits between two versions, the more complex the upgrade
- Support difficulties and latency: although flexible, our team officially only offers support on up-to-date platforms (mainly to rule out the responsibility of known bugs, and facilitate case reproduction)

| Upgrade type | Priority               | Planning and testing | Justification |
|--------------|------------------------|----------------------|---------------|
| `revision`   | Upgrade ASAP           | None                 | May contain critical fixes, should have no impact on the app. |
| `minor`      | Plan upgrade           | Low                  | If you can do a minor upgrade, it means your version is in standard maintenance period, which has a lifespan of ~6months. A **minor version** is just a slightly more impacting revision which **may** require some minor refactoring of "atypical" custom code (e.g. custom code that is not using the Simplicité Java API). The configuration remains fully compatible vs previous minor version. |
| `major`      | Put it on your roadmap | Medium               | A **major version** includes significant compatibility-breaking changes, including on the platform's technical components, that **will** require impact analysis and potential refactoring on your custom code. The configuration remains fully compatible vs previous major version except that some configuration concepts can become outdated. Upgrading to the next major version is **recommended** as no further functional changes will be done on the previous major version |

