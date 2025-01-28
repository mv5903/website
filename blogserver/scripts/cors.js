hexo.extend.filter.register('server_middleware', function (app) {
    console.log("Registering Server Middleware");
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      // If you need to allow specific methods, you can also set:
      // res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
      console.log("Middleware Registered")
      next();
    });
  });
  