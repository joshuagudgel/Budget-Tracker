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
  const [formCategory, setFormCategory] = useState({
    name: "",
    displayName: "",
    color: "",
    budgetLimit: 0,
  });

  useEffect(() => {
    if (formCategory) {
      setFormCategory({
        name: formCategory.name,
        displayName: formCategory.displayName,
        color: formCategory.color,
        budgetLimit: formCategory.budgetLimit,
      });
    }
  }, [formCategory]);

  const handleAdd = async () => {
    const newCategory: Omit<Category, "_id" | "isActive"> = {
      name: formCategory.name,
      displayName: formCategory.displayName,
      color: formCategory.color,
      budgetLimit: formCategory.budgetLimit,
    };
    try {
      await onAdd(newCategory);
    } catch (error) {
      console.error(`Error adding category: ${error}`);
    }
  };

  if (!isOpen) return null;

  return <></>;
};

export default AddCategoryModal;
