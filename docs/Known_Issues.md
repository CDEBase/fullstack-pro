

# Kown Issues

1. Backend and Frontend webpack watch loops into restart continously after upgrading to `0.5.5`. 
  
  Solution: - Delete `.awcache` and `dist` folders under `servers/backend-server` and `servers/frontend-server` and restart the servers.


2. Macbook Catalina: `Zsh` latest macos comes with `Zsh` as the default shell. We seeing some issues to start the project with it. Please use `bash` to run project.

https://www.howtogeek.com/444596/how-to-change-the-default-shell-to-bash-in-macos-catalina/