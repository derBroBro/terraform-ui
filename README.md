This project is quite old and not developed further. 
Based on my learnings an experience of the last years, I started a new projects which offers a simialar solution. 
If you are intrested about a terraform UI, check out the [HTTP-Backend for Terraform](https://github.com/derBroBro/terraform-http-backend) as well :).

# About
Terraform UI is a weekend project to provide a simple UI for the great [terraform](terraform.io) binary. Sadly this is, specially for new users, limited because not everyone is able and want to use the current (CLI) version. Also the state sharing comes to a problem in larger teams, which should be addressed by this tool.

> The project is currently just a PoC to gather ideas and testing arround how to make terraform accessable for people which are not experienced with Infra as Code yet.

You can find the first documentation [here](/DOCUMENTATION.md).

## Features
- Allows to execute terraform via web UI
- Support for multiple git backed projects
- Variables are stored on the webserver (tries to hide secret data)
- History of executions is stored including the states and changes
- (Tries to) follow the [ROCA Style](http://roca-style.org/)

## Images
### Project list
![Projects](github_images/projects.png)  
### Project details
![Project details](github_images/details.png)
### Project workspace
![Project workspace](github_images/workspace.png)
### Project version details
![Project version](github_images/version.png)

# ToDo
- [ ] Clear the code to make it more structured
- [ ] Add much more tests
- [ ] Use the user within the version history (logging)

# Ideas
- Add additional authentication providers
- Add permission system
- Allow "filesystem" to be located on aws-s3
- Extend the filesystem to be cached (speed)
