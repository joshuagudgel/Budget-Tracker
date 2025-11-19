import React, { useState, useEffect } from "react";
import { Expense, expenseService } from "../services/api";
import styles from "./ExpenseList.module.css";

interface ExpenseListProps {
  expenses?: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [changedExpenseIds, setChangedExpenseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const expenseHeaders = ["Date", "Amount", "Description"];

  const handleExpenseChange = (
    expenseId: string,
    field: string,
    value: any
  ) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === expenseId ? { ...expense, [field]: value } : expense
      )
    );
    setChangedExpenseIds((prevIds) =>
      prevIds.includes(expenseId) ? prevIds : [...prevIds, expenseId]
    );
  };

  const handleSaveClick = async () => {
    // collect changed expenses
    const changedExpenses = expenses.filter((expense) =>
      changedExpenseIds.includes(expense.id)
    );
    // call API for each expense that was changed
    await expenseService.updateExpenses(changedExpenses);

    // clear changedExpenseIds after successful save
    setChangedExpenseIds([]);
    console.log("Successfully saved changes");
  };

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
    <div className={styles.expenseList}>
      <h2>Expenses</h2>
      <table>
        <thead>
          <tr>
            {expenseHeaders.map((header) => (
              <th key={header.toLowerCase()}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan={3}>No expenses found</td>
            </tr>
          ) : (
            expenses.map((expense, index) => (
              <tr key={expense.id}>
                <td>{expense.date.split("T")[0]}</td>
                <td>${expense.amount}</td>
                <td>
                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) =>
                      handleExpenseChange(
                        expense.id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
};

export default ExpenseList;
