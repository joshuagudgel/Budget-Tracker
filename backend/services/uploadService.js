const Transaction = require('../models/Transaction');

// validate uploaded file
const validateCSVFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
  }
  
  if (file && !file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
    errors.push('Only CSV files are allowed');
  }
  
  if (file && file.size > 5 * 1024 * 1024) { // 5MB
    errors.push('File size exceeds 5MB limit');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Convert csv string to 2-D array (grid format)
// each row is an array of column values
function csvStringToArray (strData) {
    const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ? 
            arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
            arrMatches[3]);
    }

    if (arrData.length === 1 && arrData[0].length === 0) {
      throw new Error(`No valid data found in CSV string: "${strData}"`);
    }

    return arrData;
}

// Detect bank type from csv 2-D array data
// bank2 has "Transaction Date" as first column header
// bank1 has no header row
const detectBankType = (lines) => {
  if (lines.length > 0 && lines[0] && lines[0][0] === 'Transaction Date') {
    console.log("Detected Bank2");
    return 'bank2';
  } else {
    console.log("Detected Bank1");
    return 'bank1';
  }
};

// Parse transaction line based on bank format (access indexes directly)
const parseTransactionLine = (line, bankType) => {
  if (!line || line.length === 0) {
    throw new Error('Empty line data');
  }

  if(line.length > 7) throw new Error(`Line data is improperly formatted: ${line}`);

  // Access indexes depending on bank type
  let date, amountStr, description;
  
  if (bankType === 'bank1') {
    date = line[0];
    amountStr = line[1];
    description = line[4];
  } else if (bankType === 'bank2') {
    date = line[1];
    description = line[2];
    amountStr = line[5];
  } else {
    throw new Error('Invalid Bank Option');
  }

  // Validate and parse amount
  const amountNum = parseFloat(amountStr);
  if (isNaN(amountNum)) {
    throw new Error(`Invalid amount: ${amountStr}`);
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }

  return {
    date: dateObj,
    description: description?.trim() || 'No description',
    amount: amountNum,
    category: 'unsorted'
  };
};

// csvContent is a string
const processCSVData = async (csvContent) => {
  const lines = csvStringToArray(csvContent);
  const bankType = detectBankType(lines);
  const transactions = [];
  const parseErrors = [];

  const existingSortedTransactions = await checkSortedTransactions();

  // skip header row for bank2
  const startIndex = bankType === 'bank2' ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.length === 0) continue;

    try {
      const transaction = parseTransactionLine(line, bankType);
      if(transaction) {
        transaction.category = matchTransactionCategory(transaction,existingSortedTransactions);
        transactions.push(transaction);
      }
    } catch (lineError) {
      parseErrors.push(`Line ${i + 1}: '${line}' Error: ${lineError.message}`);
    }
  }

  return {
    transactions,
    parseErrors,
    bankType,
    totalLines: lines.length
  }
};

// save to database
const saveTransactions = async (transactions) => {
  if(!transactions || transactions.length === 0) {
    throw new Error('No transactions to save');
  }

  try {
    savedTransactions = await Transaction.insertMany(transactions, { ordered: false });
    return savedTransactions;
  }
  catch (error){
    console.error('Error saving transactions:', error.messsage);
  }

  throw new Error('Some transactions failed to save. Check logs for details.');
};

// gather existing transactions that have been sorted into a category
const checkSortedTransactions = async () => {
  try {
    const existingTransactions = await Transaction.find({
      category: { $ne: 'unsorted' }
    }).select('description amount category');

    return existingTransactions;
  } catch (error) {
    throw new Error(`Failed to retrieve existing transactions: ${error.message}`);
  }
};

// compare description and amount to existing transactions
const matchTransactionCategory = (newTransaction, existingTransactions) => {
  const match = existingTransactions.find(existing =>
    existing.description.toLowerCase() === newTransaction.description.toLowerCase() &&
    Math.abs(existing.amount - newTransaction.amount) < 0.01
  );

  return match ? match.category : 'unsorted';
}

module.exports = {
  validateCSVFile,
  csvStringToArray,
  detectBankType,
  parseTransactionLine,
  processCSVData,
  saveTransactions
};