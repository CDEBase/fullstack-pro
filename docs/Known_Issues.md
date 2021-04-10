

# Kown Issues


1. EACCES: permission denied, scandir .....

Follow the workaround https://github.com/cdmbase/fullstack-pro/issues/176

2. OS X: "Error: EMFILE: too many open files, watch"
Follow https://github.com/facebook/create-react-app/issues/4540

```
brew install watchman
```

3. Macbook Catalina: `Zsh` latest macos comes with `Zsh` as the default shell. We seeing some issues to start the project with it. Please use `bash` to run project.

https://www.howtogeek.com/444596/how-to-change-the-default-shell-to-bash-in-macos-catalina/