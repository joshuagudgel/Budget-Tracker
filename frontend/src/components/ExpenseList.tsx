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
      <h2>Expenses!</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan={3}>No expenses found</td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.amount}</td>
                <td>{expense.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
