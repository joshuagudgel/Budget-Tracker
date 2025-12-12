const backupService = require('../services/backupService');

// Get backup data
const getBackupData = async (req, res) => {
  try {
    const backupData = await backupService.getBackupData();
    return res.status(200).json({
      message: 'Backup data retrieved successfully',
      data: backupData
    });
  } catch (error) {
    console.error('Backup error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve backup data',
      message: error.message
    });
  }
};

// Export backup to file
const exportBackup = async (req, res) => {
  try {
    const {filename, filePath } = await backupService.exportBackup();
    return res.status(200).json({
      message: 'Backup created successfully',
      filename: filename,
      path: filePath
    });
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({
      error: 'Failed to create backup file',
      message: error.message
    });
  }
};

module.exports = {
  getBackupData,
  exportBackup
};