# Crater

## A new app skeleton for Meteor

**Note: this is not for beginners!**

Ever since I started using Meteor, Isobuild has been my biggest source of frustration with it, for the following
reasons:
* It made it more difficult to use Webpack with Meteor
* It's hard to customize index.html too much
* It's been horribly slow for me in recent versions
([Meteor build time/refresh time after file save is VERY slow](https://github.com/meteor/meteor/issues/4284) --
over 90 upvotes and it's been open since April!)
* I just want to be in control of the initial entry point, period.

Well, thanks to Babel custom resolvers and [meteor-imports-webpack-plugin](https://github.com/luisherranz/meteor-imports-webpack-plugin),
now it's possible to build and run the app without using isobuild on your userland code!  (It's only needed to
install and build meteor packages).

This should be a very helpful workaround for [https://github.com/meteor/meteor/issues/4284], because
**it doesn't output any transpiled files in dev mode**.

And for that and other reasons, this skeleton tends to start up faster than running the app through Meteor.

## How it works

**Special thanks to [Matt Krick](https://github.com/mattkrick), creator of
[Meatier](https://github.com/mattkrick/meatier) -- I learned a lot from
Meatier, and copped some of its code for this project**

`src/server/index.js` uses `piping` (to enable server restarts when the code changes) and then uses
`babel-register` with a custom `resolveModuleSource` that shims Meteor imports.  It then requires Meteor's `boot.js`,
and continues running its own ES2015 code in `src/server/main.js`, which sets up an Express server.

The Express server is configured to perform React server-side rendering, and proxy SockJS requests to Meteor's internal server so that DDP works.

I moved Meteor to port 4000 and put Express on port 3000 by default, so that you can still test the page at
`localhost:3000`.

The client-side code is bundled using Webpack and [meteor-imports-webpack-plugin](https://github.com/luisherranz/meteor-imports-webpack-plugin), and comes with all the usual
goodies in this skeleton: `react-hot-loader`, `redux`, `react-router`, `react-router-redux`.

## Obtaining
```
git clone https://github.com/jedwards1211/crater
cd crater
git remote rename origin skeleton
```

## Running

### Dev mode
Before running the app for the very first time you need to have isobuild download and build all of the Meteor packages for you.  To do that, run the following:
```
cd meteor
meteor
Ctrl-C after app starts up (this is just so Isobuild will install and build all the Meteor package deps)
cd ..
```
(You don't need to repeat the above steps again, unless `meteor/.meteor/local/build` gets messed up for some reason.)

Then you need to install the NPM modules specified in package.json:
```
npm install
```

Then after that, run:
```
npm start
```
And open http://localhost:3000 in your browser.

If you see the following error:
```
<your home dir>/.meteor/packages/meteor-tool/.1.4.1_1.msrh2w++os.osx.x86_64+web.browser+web.cordova/mt-os.osx.x86_64/dev_bundle/server-lib/node_modules/fibers/fibers.js:16
	throw new Error('`'+ modPath+ '.node` is missing. Try reinstalling `node-fibers`?');
	^

Error: `<your home dir>/.meteor/packages/meteor-tool/.1.4.1_1.msrh2w++os.osx.x86_64+web.browser+web.cordova/mt-os.osx.x86_64/dev_bundle/server-lib/node_modules/fibers/bin/darwin-x64-v8-5.0/fibers.node` is missing. Try reinstalling `node-fibers`?
```
It means you're trying to run the app with a different version of Node than Meteor 1.4.1 uses, which is okay -- you just have to manually build fibers for your Node version, like this:
```
cd <your home dir>/.meteor/packages/meteor-tool/.1.4.1_1.msrh2w++os.osx.x86_64+web.browser+web.cordova/mt-os.osx.x86_64/dev_bundle/server-lib
npm rebuild fibers
```
And then retry `npm start`.  Hopefully I can find a more robust way to handle cases like this soon.

### Prod mode
Before running prod mode, you need to build the prod version of the app:
```
npm run build
cd build/meteor/bundle/programs/server
npm install
cd <project root>
```
(You don't need to repeat the above steps unless you've changed something and need to rebuild.)

Once the app is built, run the following command:
```
npm run prod
```
And open http://localhost:3000 in your browser.

## Testing
```
npm test
```
This runs an integration test that successively runs dev and prod mode via the commands above, and tests that Meteor
integration is working via [PhantomJS](https://www.npmjs.com/package/phantomjs-prebuilt) and
[Webdriver.IO](http://webdriver.io/).
