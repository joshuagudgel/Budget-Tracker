const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

router.get('/', backupController.getBackupData);
router.post('/export', backupController.exportBackup);
router.post('/restore', backupController.restoreFromBackup);

module.exports = router;