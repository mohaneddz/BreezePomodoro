const express = require('express');
const router = express.Router();
const app = express();
const port = 3000;

router.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });