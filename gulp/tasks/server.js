export const server = (done) => {
   app.plugins.browsersync.init({
      server: {
         baseDir: `${app.path.build.html}`
      },
      notify: false, //уведомление, можно true
      port: 3000,
   });
}
