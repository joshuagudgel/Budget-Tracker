import React, { useState, useEffect } from "react";
import { Expense, Category, expenseService } from "../services/api";
import styles from "./ExpenseList.module.css";

interface ExpenseListProps {
  categories: Category[];
  expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ categories, expenses }) => {
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses);
  const [changedExpenseIds, setChangedExpenseIds] = useState<string[]>([]);
  const expenseHeaders = ["Date", "Amount", "Description", "Category"];

  console.log("Rendering ExpenseList with expenses:", expenses);

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
    // collect changed expenses
    const changedExpenses = localExpenses.filter((expense) =>
      changedExpenseIds.includes(expense._id)
    );
    // call API for each expense that was changed
    await expenseService.updateExpenses(changedExpenses);

    // clear changedExpenseIds after successful save
    setChangedExpenseIds([]);
    console.log("Successfully saved changes");
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
                <td>{expense.date.split("T")[0]}</td>
                <td>${expense.amount.toFixed(2)}</td>
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
