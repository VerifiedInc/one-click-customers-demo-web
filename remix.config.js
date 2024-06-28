/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [
    /(react-imask|imask)/,
    /node-fetch/,
    /newrelic/,
    /dnd-core/,
    /react-dnd/,
    /react-dnd-html5-backend/,
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
