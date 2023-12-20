const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();

const uploadDirectory = path.join(__dirname, '..', 'uploads');

/**
 * Handles file download requests for a specific file by filename.
 *
 * @route {GET} /server/src/uploads/:filename
 * @param {string} filename - The name of the file to be downloaded.
 * @returns {Object} - Sends the requested file for download or returns a JSON response with an error message.
 * @throws {Object} - Returns a 404 status with an error message if the file is not found.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors during download.
 */
router.get('/server/src/uploads/:filename', (req, res) => {
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
