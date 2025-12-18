import React, { useState, useEffect } from "react";
import { Transaction, Category } from "../services/api";
import styles from "./SplitTransactionModal.module.css";

interface SplitTransactionModalProps {
  isOpen: boolean;
  transactionToSplit: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onSplit: (
    transaction1: Omit<Transaction, "_id">,
    transaction2: Omit<Transaction, "_id">
  ) => Promise<void>;
}

const SplitTransactionModal: React.FC<SplitTransactionModalProps> = ({
  isOpen,
  transactionToSplit,
  categories,
  onClose,
  onSplit,
}) => {
  const [transaction1, setTransaction1] = useState({
    amount: 0,
    description: "",
    category: "",
  });
  const [transaction2, setTransaction2] = useState({
    amount: 0,
    description: "",
    category: "",
  });

  const totalAmount = transaction1.amount + transaction2.amount;
  const originalAmount = transactionToSplit?.amount || 0;
  const isValidSplit = Math.abs(totalAmount - originalAmount) < 0.01;

  useEffect(() => {
    if (transactionToSplit) {
      const halfAmount = transactionToSplit.amount / 2;
      setTransaction1({
        amount: halfAmount,
        description: transactionToSplit.description + " (Part 1)",
        category: transactionToSplit.category,
      });
      setTransaction2({
        amount: halfAmount,
        description: transactionToSplit.description + " (Part 2)",
        category: transactionToSplit.category,
      });
    }
  }, [transactionToSplit]);

  // format transaction data and send to parent to make requests
  const handleSplit = async () => {
    if (!transactionToSplit) return;

    const newTransaction1: Omit<Transaction, "_id"> = {
      amount: transaction1.amount,
      description: transaction1.description.trim(),
      category: transaction1.category,
      date: transactionToSplit.date,
      transactionType: transactionToSplit.transactionType,
    };

    const newTransaction2: Omit<Transaction, "_id"> = {
      amount: transaction2.amount,
      description: transaction2.description.trim(),
      category: transaction2.category,
      date: transactionToSplit.date,
      transactionType: transactionToSplit.transactionType,
    };

    try {
      await onSplit(newTransaction1, newTransaction2);
    } catch (error) {
      console.error("Split operation failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3>Split Transaction</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.transactionSection}>
          {transactionToSplit && (
            <div>
              <div>
                <strong>Original:</strong> $
                {transactionToSplit.amount.toFixed(2)} -{" "}
                {transactionToSplit.description}
              </div>

              <div>
                <h4>Transaction 1</h4>
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={transaction1.amount}
                    onChange={(e) =>
                      setTransaction1({
                        ...transaction1,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    value={transaction1.description}
                    onChange={(e) =>
                      setTransaction1({
                        ...transaction1,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Category</label>
                  <select
                    value={transaction1.category}
                    onChange={(e) =>
                      setTransaction1({
                        ...transaction1,
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
                <h4>Transaction 2</h4>
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={transaction2.amount}
                    onChange={(e) =>
                      setTransaction2({
                        ...transaction2,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    value={transaction2.description}
                    onChange={(e) =>
                      setTransaction2({
                        ...transaction2,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Category</label>
                  <select
                    value={transaction2.category}
                    onChange={(e) =>
                      setTransaction2({
                        ...transaction2,
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
                <div>
                  Total: $
                  {(transaction1.amount + transaction2.amount).toFixed(2)}
                </div>
                {!isValidSplit && (
                  <div className={styles.validationError}>
                    Split amounts must equal original amount
                  </div>
                )}
              </div>
              <div className={styles.actions}>
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSplit} disabled={!isValidSplit}>
                  Split Transaction
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitTransactionModal;
