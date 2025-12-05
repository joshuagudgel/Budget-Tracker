import React, { useState, useEffect } from "react";
import { Expense, Category, expenseService } from "../services/api";
import styles from "./ExpenseList.module.css";
import SplitExpenseModal from "./SplitExpenseModal";

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
  const [splitModalOpen, setSplitModalOpen] = useState<boolean>(false);
  const [expenseToSplit, setExpenseToSplit] = useState<Expense | null>(null);
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

  const handleSplitClick = (expense: Expense) => async () => {
    console.log(`Splitting expense: ${expense}`);
    setExpenseToSplit(expense);
    setSplitModalOpen(true);
  };

  const handleSplitExpense = async (
    expense1: Omit<Expense, "_id">,
    expense2: Omit<Expense, "_id">
  ) => {
    try {
      await expenseService.createExpense(expense1);
      await expenseService.createExpense(expense2);

      if (expenseToSplit) {
        await expenseService.deleteExpense(expenseToSplit._id);
      }

      setSplitModalOpen(false);
      setExpenseToSplit(null);

      onExpensesUpdated?.();
      alert("Expense Split Successfully");
    } catch (error) {
      console.error(`Error splitting expense: ${error}`);
    }
  };

  return (
    <div className={styles.expenseList}>
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
              <td colSpan={5}>No expenses found</td>
            </tr>
          ) : (
            localExpenses.map((expense) => (
              <tr className={styles.expenseListRow} key={expense._id}>
                <td>{expense.date.split("T")[0]}</td>
                <td>${expense.amount}</td>
                <td>
                  <input
                    className={styles.descriptionInput}
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
                    className={styles.categorySelect}
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
                  <button
                    className={styles.expenseActions}
                    onClick={handleSplitClick(expense)}
                  >
                    {"| |"}
                  </button>
                  <button
                    className={styles.expenseActions}
                    onClick={handleDeleteClick(expense._id)}
                  >
                    x
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className={styles.buttonRow}>
        <button className={styles.expenseActions} onClick={handleSaveClick}>
          Save
        </button>
      </div>
      <SplitExpenseModal
        isOpen={splitModalOpen}
        expenseToSplit={expenseToSplit}
        categories={categories}
        onClose={() => {
          setSplitModalOpen(false);
          setExpenseToSplit(null);
        }}
        onSplit={handleSplitExpense}
      />
    </div>
  );
};

export default ExpenseList;
