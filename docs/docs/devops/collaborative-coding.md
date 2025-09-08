---
sidebar_position: 320
title: Collaborative Coding
---

# Collaborative Coding with Simplicité

This document outlines best practices and workflows for collaborative development on Simplicité platform projects. It provides guidance for teams working together on Simplicité applications, covering version control, environment setup, access management, and quality practices.

Collaborative development on Simplicité projects requires careful coordination between team members, proper version control practices, and effective use of the platform's built-in collaboration features. The foundation of successful team collaboration is proper Git repository management for modules and adherence to established workflows.

## Environment Setup

### Individual Development Environments

For effective collaborative development, each team member should have:

- **One Simplicité environment per developer** - Each developer should have their own dedicated Simplicité instance
- **One Git repository per project** - Use a centralized Git repository (e.g., GitLab, GitHub) for the project
- **External development tools** - Use IDEs like VS Code for enhanced development capabilities

### Repository Configuration

Each Simplicité module can be exposed as a Git repository, enabling standard collaborative workflows. When setting up modules for collaborative work:

- Modules are **non-bare repositories** - The local worktree is needed by the export/import processes
- Configure HTTP(S) access with the following settings in `.git/config`:
  ```ini
  [http]
      uploadpack = true
      receivepack = true
  ```

## Recommended Development Workflow

Based on real-world experience from Simplicité integrator teams, here's the recommended workflow for feature development:

### Before Starting Implementation

1. **Pull the latest version** from the main GitLab repository
2. **Push to your Simplicité instance** using the import module functionality
3. **Ensure your local environment is up to date**

### During Feature Development

1. **Implement your feature** in your local Simplicité environment
2. **Commit the feature** from within the Simplicité instance
3. **Create a feature branch** (`myfeature`) from the main branch in GitLab
4. **Cherry-pick the commit** containing your feature to the new branch
5. **Push to the feature branch** in GitLab

### After Implementation

1. **Create a merge request** for your feature branch
2. **Request code review** from team members
3. **Address feedback** and make necessary changes
4. **Merge the request** after approval

## External Editor Integration

### VS Code Setup

For teams using VS Code, install the following extensions:

- **[Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)** - Provides IntelliSense and Java debugging tools
- **[Simplicité VSCode tools extension](https://marketplace.visualstudio.com/items?itemName=SimpliciteSoftware.simplicite-vscode-tools)** (optional) - Allows pushing code directly to Simplicité instances

:::warning
You must activate the `DEV_MODE` system parameter for the Simplicité VSCode extension to work.
:::

### Development Workflow with External Editors

The typical workflow when using external editors:

1. **Configuration changes** in Simplicité
2. **Commit changes** in Simplicité
3. **Pull changes** from Simplicité to local environment
4. **Local development work** in your preferred IDE
5. **Commit changes** locally
6. **Push changes** back to Simplicité

## Code Quality and Security Practices

### Testing and Quality Assurance

- **Use private browser windows** for testing to avoid session conflicts between test and designer users
- **Implement unit testing** with proper coverage measurement
- **Use code quality tools** like SonarQube for continuous quality monitoring

### Security Considerations

For collaborative environments, implement proper security measures:

- **Strong passwords** for designer users (change regularly)
- **Two-factor authentication (2FA)** using authentication applications (Google or Microsoft Authenticator)
- **Deactivate designer accounts** when not in use (may complicate delivery processes)
- **Regular security audits** and access reviews

### Code Quality Tools

Integrate code quality tools into your development workflow:

- **SonarQube integration** for automated code analysis
- **Unit test coverage** measurement using JaCoCo
- **Automated testing** in CI/CD pipelines

## Additional Resources

- [Git Repositories Documentation](/docs/integration/webservices/git-repositories)
- [External Editor Setup](/docs/devops/external-editor)
- [Code Quality Tools](/docs/devops/code-quality)
- [Security Best Practices](/docs/security)
- [Docker Deployment](/docs/operation/docker)
