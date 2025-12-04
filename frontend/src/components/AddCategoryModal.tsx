import React, { useState, useEffect } from "react";
import { Category } from "../services/api";
import styles from "./AddCategoryModal.module.css";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCategory: Omit<Category, "_id" | "isActive">) => Promise<void>;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    displayName: "",
    color: "",
    budgetLimit: 0,
  });

  const isValidCategory = () => {
    const isValidCategory =
      newCategory.name &&
      newCategory.name === newCategory.name.toLowerCase() &&
      !newCategory.name.includes(" ") &&
      newCategory.displayName.trim().length > 0 &&
      /^#[0-9A-Fa-f]{6}$/.test(newCategory.color) &&
      newCategory.budgetLimit > 0;

    return isValidCategory;
  };

  const handleAdd = async () => {
    if (!isValidCategory) return;

    try {
      await onAdd(newCategory);
    } catch (error) {
      console.error(`Error adding category: ${error}`);
    }
  };

  const handleClose = () => {
    setNewCategory({
      name: "",
      displayName: "",
      color: "",
      budgetLimit: 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3>Add Category</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <input
          type="text"
          placeholder="Name (lowercase, no spaces)"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Display Name"
          value={newCategory.displayName}
          onChange={(e) =>
            setNewCategory({ ...newCategory, displayName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Color (#FF5733)"
          value={newCategory.color}
          onChange={(e) =>
            setNewCategory({ ...newCategory, color: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Budget Limit"
          value={newCategory.budgetLimit}
          onChange={(e) =>
            setNewCategory({
              ...newCategory,
              budgetLimit: parseFloat(e.target.value) || 0,
            })
          }
        />
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleClose}
        >
          Cancel
        </button>
        <button onClick={handleAdd} disabled={!isValidCategory()}>
          Create
        </button>
      </div>
    </div>
  );
};

export default AddCategoryModal;
