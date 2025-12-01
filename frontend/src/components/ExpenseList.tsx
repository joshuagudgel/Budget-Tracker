import React, { useState, useEffect } from "react";
import { Expense, Category, expenseService } from "../services/api";
import styles from "./ExpenseList.module.css";

interface ExpenseListProps {
  categories: Category[];
  expenses: Expense[];
  onExpensesUpdated?: () => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  categories,
  expenses,
  onExpensesUpdated,
}) => {
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses);
  const [changedExpenseIds, setChangedExpenseIds] = useState<string[]>([]);
  const expenseHeaders = [
    "Date",
    "Amount",
    "Description",
    "Category",
    "Split/Delete",
  ];

  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  const handleExpenseChange = (
    expenseId: string,
    field: string,
    value: any
  ) => {
    setLocalExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense._id === expenseId ? { ...expense, [field]: value } : expense
      )
    );
    setChangedExpenseIds((prevIds) =>
      prevIds.includes(expenseId) ? prevIds : [...prevIds, expenseId]
    );
  };

  const handleSaveClick = async () => {
    try {
      // collect changed expenses
      const changedExpenses = localExpenses.filter((expense) =>
        changedExpenseIds.includes(expense._id)
      );

      if (changedExpenses.length === 0) {
        return;
      }
      // call API for each expense that was changed
      await expenseService.updateExpenses(changedExpenses);

      onExpensesUpdated?.();

      // clear changedExpenseIds after successful save
      setChangedExpenseIds([]);
      alert("Expenses saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteClick = (expenseId: string) => async () => {
    try {
      await expenseService.deleteExpense(expenseId);
      setLocalExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseId)
      );
      onExpensesUpdated?.();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleSplitClick = (expenseId: string) => async () => {
    try {
      window.alert(`Splitting expense with ID: ${expenseId}`);
    } catch (error) {
      console.error("Error splitting expense:", error);
    }
  };

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
          {localExpenses.length === 0 ? (
            <tr>
              <td colSpan={3}>No expenses found</td>
            </tr>
          ) : (
            localExpenses.map((expense) => (
              <tr key={expense._id}>
                <td>
                  <input
                    type="date"
                    value={expense.date.split("T")[0]}
                    onChange={(e) =>
                      handleExpenseChange(expense._id, "date", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={expense.amount}
                    onChange={(e) =>
                      handleExpenseChange(
                        expense._id,
                        "amount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) =>
                      handleExpenseChange(
                        expense._id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <select
                    value={expense.category || ""}
                    onChange={(e) =>
                      handleExpenseChange(
                        expense._id,
                        "category",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.displayName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={handleSplitClick(expense._id)}>Split</button>
                  <button onClick={handleDeleteClick(expense._id)}>
                    Delete
                  </button>
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
