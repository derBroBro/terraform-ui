> This project is in a very early development state!  
> It is not nearly ready for production usage!


# Installation
- Clone the git repo
- Download the latest terraform binary and store it in the ```bin/``` directory (currently only windows is tested!)
- Run ```npm install```
- Start the app with ```node index.js```
- Go to ```http://localhost:3000```
- Default login is admin / terraformui

# Configuration
All configurations are defined within JSON files.
The most important files are:  
```config.json  ```  
Contains server related settings like:
- Username / Password
- Port
- Log level

```data/[project-id]/metadata.json  ```  
Contains project configurations:
- Git url
- Username / Password
- Branch
- Displayname
- Variables
- Permissions (not used yet)

```data/[project-id]/version.json  ```  
Contains the version history.

The Terraform states are held within the project directory.
All statefiles and the current terraform-ui states are stored within the workspace directory.

# Backup
If you want to backup your data, just copy the content of the ```data/[project-id]``` folder. The workspace subdirectory should be excluded as it holds just a temorary state.
