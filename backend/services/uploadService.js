const Expense = require('../models/Expense');

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
    return arrData;
}

// Detect bank type from csv 2-D array data
// bank1 has "Transaction Date" as first column header
// bank2 has no header row
const detectBankType = (lines) => {
  if (lines.length > 0 && lines[0] && lines[0][0] === 'Transaction Date') {
    console.log("Detected Bank1");
    return 'bank1';
  } else {
    console.log("Detected Bank2");
    return 'bank2';
  }
};

// Parse expense line based on bank format (access indexes directly)
const parseExpenseLine = (line, bank) => {
  if (!line || line.length === 0) {
    throw new Error('Empty line data');
  }

  // Access indexes depending on bank type
  let date, amountStr, description;
  
  if (bank === 'bank1') {
    date = line[0];
    description = line[2];
    amountStr = line[5];
  } else if (bank === 'bank2') {
    date = line[0];
    amountStr = line[1];
    description = line[4];
  } else {
    throw new Error('Invalid Bank Option');
  }

  // Validate and parse amount
  const amountNum = (-1) * parseFloat(amountStr);
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
    category: 'unsorted',
    paymentMethod: 'other'
  };
};

// csvContent is a string
const processCSVData = (csvContent) => {
  const lines = csvStringToArray(csvContent);
  const bankType = detectBankType(lines);
  const expenses = [];
  const parseErrors = [];

  // skip header row for bank1
  const startIndex = bankType === 'bank1' ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.length === 0) continue;

    try {
      const expense = parseExpenseLine(line, bankType);
      console.log("parsed expense:", expense);
      if(expense) {
        expenses.push(expense);
      }
    } catch (lineError) {
      parseErrors.push(`Line ${i + 1}: '${line}' Error: ${lineError.message}`);
    }
  }

  return {
    expenses,
    parseErrors,
    bankType,
    totalLines: lines.length
  }
};

// save to database
const saveExpenses = async (expenses) => {
  if(!expenses || expenses.length === 0) {
    throw new Error('No expenses to save');
  }

  return await Expense.insertMany(expenses, { ordered: false });
};

module.exports = {
  csvStringToArray,
  detectBankType,
  parseExpenseLine,
  processCSVData,
  saveExpenses
};