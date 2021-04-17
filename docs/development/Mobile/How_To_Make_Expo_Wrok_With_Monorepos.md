

https://medium.com/habilelabs/react-native-react-web-and-expo-together-in-one-monorepo-5b8f9a0fca00

As per the documentation, expo-yarn-workspaces work only on macOS and UNIX based systems, Windows is not supported.
If we want it to work on Windows as well, then we need to make slight modifications to it.
Firstly, remove the postinstallscript from package.json and move it to the main package.json-
"postinstall": "cd ./packages/ExpoApp && expo-yarn-workspaces postinstall"

