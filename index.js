const express = require('express');
const app = express();
const router = require('./modules/router');

router(app);

app.listen(3000, () => {
  console.log('SERVER START:', new Date);
})
