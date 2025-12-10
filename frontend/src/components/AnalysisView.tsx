import { Expense, Category } from "../services/api";
import React, { useMemo, useState } from "react";
import ExpenseTable from "./ExpenseTable";

interface AnalysisViewProps {
  expenses: Expense[];
  categories: Category[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({
  expenses,
  categories,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const years = ["2025", "2024"];

  const tableData = useMemo(() => {
    const yearNumber = parseInt(selectedYear, 10);

    const yearlyExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date.getFullYear() === yearNumber;
    });

    // Group by month for table
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthExpenses = yearlyExpenses.filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() + 1 === month;
      });

      const categoryBreakdown = categories.reduce((acc, cat) => {
        acc[cat.name] = monthExpenses
          .filter((exp) => exp.category === cat.name)
          .reduce((sum, exp) => sum + exp.amount, 0);
        return acc;
      }, {} as Record<string, number>);

      return {
        month: new Date(yearNumber, i, 1).toLocaleDateString("en-US", {
          month: "short",
        }),
        total: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        ...categoryBreakdown,
      };
    });

    return monthlyTotals;
  }, [expenses, categories, selectedYear]);

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
          <option value={year}>{year}</option>
        ))}
      </select>

      <ExpenseTable data={tableData} categories={categories} />
    </div>
  );
};

export default AnalysisView;
