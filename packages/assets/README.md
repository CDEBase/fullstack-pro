
#### ASSETS
Assets are stored and complied for two reasons.
i. Webpack and ESM require are different, so we used compiled file under `lib` for any package dependency.
ii. We need asset files 
## Generate 

# Install on Ubuntu
sudo apt-get install inkscape

## in mac
brew install inkscape

# Other systems: make sure Inkscape is in your PATH
cd packages/favicon/src

inkscape -w 16 -h 16 -o assets/favicon-16x16.png original/master.svg
inkscape -w 32 -h 32 -o assets/favicon-32x32.png original/master.svg
inkscape -w 150 -h 150 -o assets/mstile-150x50.png original/master.svg
inkscape -w 192 -h 192 -o assets/android-chrome-192x192.png original/master.svg
inkscape -w 256 -h 256 -o assets/android-chrome-256x256.png original/master.svg
inkscape -w 180 -h 180 -o assets/apple-touch-icon-180x180.png original/master.svg
inkscape -w 120 -h 120 -o assets/apple-touch-icon-120x120.png original/master.svg
inkscape -w 700 -h 700 -o assets/safari-pinned-tab.svg original/master.svg

