const express = require('express');
const images = require('./crop-image.js')

const app = express();
const port = 3000;

app.get('/crop', async(req, res) => {
    console.log(req.query)
    const { url } = req.query;
    if (url) {
      const data = await images.cropImage(url);
      return res.json({ data });
    }
    else {
      return res.json({ data: 'pls send correct params' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});