import { Expense, Category } from "../services/api";
import React, { useMemo, useState } from "react";

interface AnalysisViewProps {
  expenses: Expense[];
  categories: Category[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({
  expenses,
  categories,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("10");
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const monthlyExpenses = useMemo(() => {
    const currentYear = new Date().getUTCFullYear();
    const monthNumber = parseInt(selectedMonth, 10);
    return expenses.filter((expense) => {
      const dateString = expense.date.split("T")[0];
      const [year, month] = dateString
        .split("-")
        .map((num) => parseInt(num, 10));
      return year === currentYear && month === monthNumber;
    });
  }, [expenses, selectedMonth]);

  const generateReport = () => {
    setLoading(true);
    try {
      const total = monthlyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      setTotalExpenses(total);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Analysis</h2>
      <p>Total Expenses</p>

      <label>Month: </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
      </select>

      <button onClick={generateReport} disabled={loading}>
        Generate Report
      </button>

      {totalExpenses > 0 && (
        <div>
          <h2>Total Expenses: ${totalExpenses.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
