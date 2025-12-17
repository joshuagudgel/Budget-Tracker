const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const fs = require('fs').promises;
const path = require('path');

const cleanData = (data, type) => {
  if (type === 'transaction') {
    return data.map(exp => ({
      amount: exp.amount,
      description: exp.description,
      date: exp.date,
      category: exp.category,
      paymentMethod: exp.paymentMethod
    }));
  } else if (type === 'category') {
    return data.map(cat => ({
      name: cat.name,
      displayName: cat.displayName,
      color: cat.color,
      budgetLimit: cat.budgetLimit
    }));
  }
  return data;
};

const getBackupData = async () => {
  const transactions = await Transaction.find().sort({ date: -1 });
  const categories = await Category.find();

  return {
    transactions: cleanData(transactions, 'transaction'),
    categories: cleanData(categories, 'category')
  };
};

const exportBackup = async () => {
  const backupData = await getBackupData();
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `budget-backup-${timestamp}.json`;

  const backupDir = path.join(process.cwd(), 'backups');
  await fs.mkdir(backupDir, { recursive: true });

  const filePath = path.join(backupDir, filename);
  await fs.writeFile(filePath, JSON.stringify(backupData, null, 2));

  return { filename, filePath };
};

module.exports = {
  cleanData,
  getBackupData,
  exportBackup
};