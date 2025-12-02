import React, { useState, useEffect } from "react";
import { Expense, Category } from "../services/api";
import styles from "./SplitExpenseModal.module.css";

interface SplitExpenseModalProps {
  isOpen: boolean;
  expenseToSplit: Expense | null;
  categories: Category[];
  onClose: () => void;
  onSplit: (
    expense1: Omit<Expense, "_id">,
    expense2: Omit<Expense, "_id">
  ) => Promise<void>;
}

const SplitExpenseModal: React.FC<SplitExpenseModalProps> = ({
  isOpen,
  expenseToSplit,
  categories,
  onClose,
}) => {
  const [expense1, setExpense1] = useState({
    amount: 0,
    description: "",
    category: "",
  });
  const [expense2, setExpense2] = useState({
    amount: 0,
    description: "",
    category: "",
  });

  useEffect(() => {
    if (expenseToSplit) {
      const halfAmount = expenseToSplit.amount / 2;
      setExpense1({
        amount: halfAmount,
        description: expenseToSplit.description + " (Part 1)",
        category: expenseToSplit.category,
      });
      setExpense2({
        amount: halfAmount,
        description: expenseToSplit.description + " (Part 2)",
        category: expenseToSplit.category,
      });
    }
  }, [expenseToSplit]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3>Split Expense</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.expenseSection}>
          {expenseToSplit && (
            <div>
              <div>
                <strong>Original:</strong> ${expenseToSplit.amount.toFixed(2)} -{" "}
                {expenseToSplit.description}
              </div>

              <div>
                <h4>Expense 1</h4>
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expense1.amount}
                    onChange={(e) =>
                      setExpense1({
                        ...expense1,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    value={expense1.description}
                    onChange={(e) =>
                      setExpense1({
                        ...expense1,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Category</label>
                  <select
                    value={expense1.category}
                    onChange={(e) =>
                      setExpense1({
                        ...expense1,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <h4>Expense 2</h4>
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expense2.amount}
                    onChange={(e) =>
                      setExpense2({
                        ...expense2,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    value={expense2.description}
                    onChange={(e) =>
                      setExpense2({
                        ...expense2,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Category</label>
                  <select
                    value={expense2.category}
                    onChange={(e) =>
                      setExpense2({
                        ...expense2,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitExpenseModal;
