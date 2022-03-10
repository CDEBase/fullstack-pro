
#### ASSETS
Assets are stored and complied for two reasons.
i. Webpack and ESM require are different, so we used compiled file under `lib` for any package dependency.
ii. We need asset files 
## Generate 

# Install on Ubuntu
sudo apt-get install inkscape
sudo apt-get install imagemagick

## in mac
brew install inkscape
brew install imagemagick
# Other systems: make sure Inkscape is in your PATH
cd packages/assets/src

inkscape -w 16 -h 16 -o assets/favicon-16x16.png original/master.svg
inkscape -w 32 -h 32 -o assets/favicon-32x32.png original/master.svg
inkscape -w 48 -h 48 -o assets/favicon-48x48.png original/master.svg
inkscape -w 150 -h 150 -o assets/mstile-150x50.png original/master.svg
inkscape -w 192 -h 192 -o assets/android-chrome-192x192.png original/master.svg
inkscape -w 256 -h 256 -o assets/android-chrome-256x256.png original/master.svg

inkscape -w 256 -h 256 -o assets/logo-512x512.png original/master.svg

inkscape -w 180 -h 180 -o assets/apple-touch-icon-180x180.png original/master.svg
inkscape -w 120 -h 120 -o assets/apple-touch-icon-120x120.png original/master.svg
inkscape -w 700 -h 700 -o assets/safari-pinned-tab.svg original/master.svg

convert assets/favicon-16x16.png assets/favicon-32x32.png assets/favicon-48x48.png assets/favicon.ico

Optional - Make sure your ICO contains everything:
```
$ identify assets/favicon.ico
assets/favicon.ico[0] ICO 16x16 16x16+0+0 8-bit sRGB 0.000u 0:00.001
assets/favicon.ico[1] ICO 32x32 32x32+0+0 8-bit sRGB 0.000u 0:00.001
assets/favicon.ico[2] ICO 48x48 48x48+0+0 8-bit sRGB 15086B 0.000u 0:00.000
```


Phones
--
inkscape -w 64 -h 64 -o ../../../portable-devices/mobile/assets/images/favicon.png original/master.svg