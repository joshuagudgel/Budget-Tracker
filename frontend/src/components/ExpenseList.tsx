import React, { useState, useEffect } from "react";
import { Expense, expenseService } from "../services/api";

interface ExpenseListProps {
  expenses?: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await expenseService.getAllExpenses();
        setExpenses(data);
      } catch (error) {
        setError("Failed to fetch expenses");
        console.error("Failed to fetch expenses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <div>Loading expenses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            Date: {expense.date}
            Amount: ${expense.amount}
            Description: {expense.description};
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
