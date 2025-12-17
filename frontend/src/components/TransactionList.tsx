import React, { useState, useEffect } from "react";
import { Transaction, Category, transactionService } from "../services/api";
import styles from "./TransactionList.module.css";
import SplitTransactionModal from "./SplitTransactionModal";

interface TransactionListProps {
  categories: Category[];
  transactions: Transaction[];
  onTransactionsUpdated?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  categories,
  transactions,
  onTransactionsUpdated,
}) => {
  const [localTransactions, setLocalTransactions] =
    useState<Transaction[]>(transactions);
  const [changedTransactionIds, setChangedTransactionIds] = useState<string[]>(
    []
  );
  const [splitModalOpen, setSplitModalOpen] = useState<boolean>(false);
  const [transactionToSplit, setTransactionToSplit] =
    useState<Transaction | null>(null);
  const transactionHeaders = [
    "Date",
    "Amount",
    "Description",
    "Category",
    "Split/Delete",
  ];

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const handleTransactionChange = (
    transactionId: string,
    field: string,
    value: any
  ) => {
    setLocalTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction._id === transactionId
          ? { ...transaction, [field]: value }
          : transaction
      )
    );
    setChangedTransactionIds((prevIds) =>
      prevIds.includes(transactionId) ? prevIds : [...prevIds, transactionId]
    );
  };

  const handleSaveClick = async () => {
    try {
      // collect changed transactions
      const changedTransactions = localTransactions.filter((transaction) =>
        changedTransactionIds.includes(transaction._id)
      );

      if (changedTransactions.length === 0) {
        return;
      }
      // call API for each transaction that was changed
      await transactionService.updateTransactions(changedTransactions);

      onTransactionsUpdated?.();

      // clear changedTransactionIds after successful save
      setChangedTransactionIds([]);
      alert("Transactions saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteClick = (transactionId: string) => async () => {
    try {
      await transactionService.deleteTransaction(transactionId);
      setLocalTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction._id !== transactionId
        )
      );
      onTransactionsUpdated?.();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleSplitClick = (transaction: Transaction) => async () => {
    console.log(`Splitting transaction: ${transaction}`);
    setTransactionToSplit(transaction);
    setSplitModalOpen(true);
  };

  const handleSplitTransaction = async (
    transaction1: Omit<Transaction, "_id">,
    transaction2: Omit<Transaction, "_id">
  ) => {
    try {
      await transactionService.createTransaction(transaction1);
      await transactionService.createTransaction(transaction2);

      if (transactionToSplit) {
        await transactionService.deleteTransaction(transactionToSplit._id);
      }

      setSplitModalOpen(false);
      setTransactionToSplit(null);

      onTransactionsUpdated?.();
      alert("Transaction Split Successfully");
    } catch (error) {
      console.error(`Error splitting transaction: ${error}`);
    }
  };

  return (
    <div className={styles.transactionList}>
      <table>
        <thead>
          <tr>
            {transactionHeaders.map((header) => (
              <th key={header.toLowerCase()}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {localTransactions.length === 0 ? (
            <tr>
              <td colSpan={5}>No transactions found</td>
            </tr>
          ) : (
            localTransactions.map((transaction) => (
              <tr className={styles.transactionListRow} key={transaction._id}>
                <td>{transaction.date.split("T")[0]}</td>
                <td>${transaction.amount}</td>
                <td>
                  <input
                    className={styles.descriptionInput}
                    type="text"
                    value={transaction.description}
                    onChange={(e) =>
                      handleTransactionChange(
                        transaction._id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <select
                    className={styles.categorySelect}
                    value={transaction.category || ""}
                    onChange={(e) =>
                      handleTransactionChange(
                        transaction._id,
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
                    className={styles.transactionActions}
                    onClick={handleSplitClick(transaction)}
                  >
                    {"| |"}
                  </button>
                  <button
                    className={styles.transactionActions}
                    onClick={handleDeleteClick(transaction._id)}
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
        <button className={styles.transactionActions} onClick={handleSaveClick}>
          Save
        </button>
      </div>
      <SplitTransactionModal
        isOpen={splitModalOpen}
        transactionToSplit={transactionToSplit}
        categories={categories}
        onClose={() => {
          setSplitModalOpen(false);
          setTransactionToSplit(null);
        }}
        onSplit={handleSplitTransaction}
      />
    </div>
  );
};

export default TransactionList;
