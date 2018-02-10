const express = require('express');
const app = express();
const router = require('./modules/router');

router(app);

app.listen(10002, () => {
  console.log('SERVER START:', new Date);
})
