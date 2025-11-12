const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/images/:imageName', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'images', req.params.imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.sendFile(imagePath);
  });
});
