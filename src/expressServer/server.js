const express = require('express');

const app = express();
app.use('/', require('./routes'));

const port = process.env.EXPRESS_PORT;
if (port !== undefined) {
  app.listen(port, () => {
    console.log(`Express Server listening on port :${port}!\n`);
  });
} else {
  app.listen(() => {
    console.log(`EXPRESS_PORT undefined`);
  });
}
