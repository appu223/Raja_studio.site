const app = require('./app');
const config = require('./config/config');

app.listen(config.port, () => {
  console.log('====================================================');
  console.log(` RAJA STUDIO API SERVER RUNNING`);
  console.log(` URL: http://localhost:${config.port}`);
  console.log(` Health Check: http://localhost:${config.port}/api/health`);
  console.log('====================================================');
});
