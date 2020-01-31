# ggj20phaser
The phaser frontend part of our GGJ20 game

This project is the frontend part designed to be used by supporting players on mobile devices.
This is a part of a larger project including a Unity game engine 3D game and a backend API that connects that and this phaser web game, found here:  https://github.com/irreal/ggj20backend

Phaser is a fully client side JS game engine, and this whole project runs fully in the browser.
However, in order to serve this project to a web browser, it has to be processed by webpack to bundle dependencies, resolve modules, minify, etc.

First step after cloning the repository is to run `npm install` to get the dependencies.

After that, running `npm run dev` will start webpack in development mode, which means webpack will continuously compile code for you and reload the page when you make changes in source code

When you are done with your changes, either bump the version manually in package.json or run `npm version minor`.

After that, push your changes to github, this will trigger an automatic build process with netlify, and push the latest app live to `https://bugtheplayer.live` if the build succeeds.

You can also run `npm run build` locally to get the final build on your machine, all the files that need to be statically served to the browser will be located in the /dist folder
