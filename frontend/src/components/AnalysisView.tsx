import { Transaction, Category } from "../services/api";
import React, { useMemo, useState } from "react";
import ExpenseTable from "./ExpenseTable";

interface AnalysisViewProps {
  transactions: Transaction[];
  categories: Category[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({
  transactions,
  categories,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedType, setSelectedType] = useState<string>("expense");
  const years = ["2025", "2024"];
  const transactionTypeOptions = [
    { value: "expense", displayName: "Expenses" },
    { value: "income", displayName: "Income" },
    { value: "transfer", displayName: "Transfers" },
    { value: "all", displayName: "All Transactions" },
  ];

  const tableData = useMemo(() => {
    const yearNumber = parseInt(selectedYear, 10);

    const filteredTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      const yearMatch = date.getFullYear() === yearNumber;
      const typeMatch =
        selectedType === "all" || transaction.transactionType === selectedType;
      return yearMatch && typeMatch;
    });

    // Group by month for table
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthTransactions = filteredTransactions.filter((transaction) => {
        const date = new Date(transaction.date);
        return date.getMonth() + 1 === month;
      });

      const categoryBreakdown = categories.reduce((acc, cat) => {
        acc[cat.name] = monthTransactions
          .filter((exp) => exp.category === cat.name)
          .reduce((sum, exp) => sum + exp.amount, 0);
        return acc;
      }, {} as Record<string, number>);

      return {
        month: new Date(yearNumber, i, 1).toLocaleDateString("en-US", {
          month: "short",
        }),
        total: monthTransactions.reduce((sum, exp) => sum + exp.amount, 0),
        ...categoryBreakdown,
      };
    });

    return monthlyTotals;
  }, [transactions, categories, selectedYear, selectedType]);

  return (
    <div>
      <h2>Analysis</h2>
      <p>Total Expenses</p>

      <label>Year: </label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <label>Transaction Type: </label>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        {transactionTypeOptions.map((transactionType) => (
          <option key={transactionType.value} value={transactionType.value}>
            {transactionType.displayName}
          </option>
        ))}
      </select>

      <ExpenseTable data={tableData} categories={categories} />
    </div>
  );
};

export default AnalysisView;
