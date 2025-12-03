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
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonth, setSelectedMonth] = useState<string>("1");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const months = [
    { name: "January", number: "1" },
    { name: "February", number: "2" },
    { name: "March", number: "3" },
    { name: "April", number: "4" },
    { name: "May", number: "5" },
    { name: "June", number: "6" },
    { name: "July", number: "7" },
    { name: "August", number: "8" },
    { name: "September", number: "9" },
    { name: "October", number: "10" },
    { name: "November", number: "11" },
    { name: "December", number: "12" },
  ];
  const years = ["2025", "2024"];

  const monthlyExpenses = useMemo(() => {
    const yearNumber = parseInt(selectedYear, 10);
    const monthNumber = parseInt(selectedMonth, 10);

    return expenses.filter((expense) => {
      const dateString = expense.date.split("T")[0];
      const [year, month] = dateString
        .split("-")
        .map((num) => parseInt(num, 10));

      const isCorrectYear = year === yearNumber;
      const isCorrectMonth = month === monthNumber;
      const isCorrectCategory =
        selectedCategory === "all" || expense.category === selectedCategory;

      return isCorrectYear && isCorrectMonth && isCorrectCategory;
    });
  }, [expenses, selectedMonth, selectedCategory, selectedYear]);

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

      <label>Year: </label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {years.map((year) => (
          <option value={year}>{year}</option>
        ))}
      </select>

      <label>Month: </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {months.map((month) => (
          <option value={month.number}>{month.name}</option>
        ))}
      </select>

      <label>Category: </label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">All</option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.displayName}
          </option>
        ))}
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
