import React from "react";
import { Expense, Category } from "../services/api";
import styles from "./SplitExpenseModal.module.css";

interface SplitExpenseModalProps {
  isOpen: boolean;
  expenseToSplit: Expense | null;
  categories: Category[];
  onClose: () => void;
}

const SplitExpenseModal: React.FC<SplitExpenseModalProps> = ({
  isOpen,
  expenseToSplit,
  categories,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default SplitExpenseModal;
