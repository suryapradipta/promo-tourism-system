const path = require('path');
const fs = require('fs');
const express = require("express");
const router = express.Router();

const uploadDirectory = path.join(__dirname, '..', 'uploads');

router.get('/server/src/uploads/:filename',(req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDirectory, filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
});

module.exports = router;

