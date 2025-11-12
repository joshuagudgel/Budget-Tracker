const { parseExpenseLine } = require('./expenses');

const testCases = [
  { input: "11-01     Grocery shopping 45.50", expected: "success" },
  { input: "11-02     Gas 32.00", expected: "success" },
  { input: "invalid", expected: "error" },
  { input: "11-03     Multiple word description here 15.75", expected: "success" }
];

testCases.forEach((test, i) => {
  console.log(`\n--- Test ${i + 1} ---`);
  console.log(`Input: "${test.input}"`);

  try {
    const result = parseExpenseLine(test.input);
    console.log("Parsed Result:", result);
  } catch (error) {
    console.log("Parse Error: ", error.message);
  }
});