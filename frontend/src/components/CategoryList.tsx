import { useState, useEffect } from "react";
import { Category, categoryService } from "../services/api";
import styles from "./CategoryList.module.css";
import AddCategoryModal from "./AddCategoryModal";

interface CategoryListProps {
  categories: Category[];
  onCategoriesUpdated?: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategoriesUpdated,
}) => {
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);
  const [changedCategoryIds, setChangedCategoryIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const categoryHeaders = [
    "Name",
    "Display Name",
    "Color",
    "Budget Limit",
    "Delete",
  ];

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleCategoryChange = (
    categoryId: string,
    field: string,
    value: string | number
  ) => {
    setLocalCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === categoryId ? { ...category, [field]: value } : category
      )
    );
    setChangedCategoryIds((prevIds) =>
      prevIds.includes(categoryId) ? prevIds : [...prevIds, categoryId]
    );
  };

  const handleSaveClick = async () => {
    try {
      const changedCategories = localCategories.filter((category) =>
        changedCategoryIds.includes(category._id)
      );

      if (changedCategories.length === 0) {
        return;
      }
      await categoryService.updateCategories(changedCategories);

      setChangedCategoryIds([]);
      onCategoriesUpdated?.();

      alert("Categories saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleCreateCategory = async (
    newCategory: Omit<Category, "_id" | "isActive">
  ) => {
    try {
      await categoryService.createCategory(newCategory);

      onCategoriesUpdated?.();

      setShowAddModal(false);

      alert("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setLocalCategories((prev) =>
        prev.filter((cat) => cat._id !== categoryId)
      );
      onCategoriesUpdated?.();
      alert("Category deleted successfully");
    } catch (error) {
      console.error(`Error deleting category: ${error}`);
    }
  };

  return (
    <div className={styles.categoryList}>
      <table>
        <thead>
          <tr>
            {categoryHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4}>No categories found</td>
            </tr>
          ) : (
            localCategories.map((category) => (
              <tr className={styles.categoryListRow} key={category._id}>
                <td>
                  <input
                    className={styles.categoryInput}
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      handleCategoryChange(category._id, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className={styles.categoryInput}
                    type="text"
                    value={category.displayName}
                    onChange={(e) =>
                      handleCategoryChange(
                        category._id,
                        "displayName",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className={styles.categoryInput}
                    type="text"
                    value={category.color}
                    onChange={(e) =>
                      handleCategoryChange(
                        category._id,
                        "color",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className={styles.categoryInput}
                    type="number"
                    value={category.budgetLimit}
                    onChange={(e) =>
                      handleCategoryChange(
                        category._id,
                        "budgetLimit",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <button
                    className={styles.categoryActions}
                    onClick={() => handleDeleteCategory(category._id)}
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
        <button className={styles.categoryActions} onClick={handleSaveClick}>
          Save
        </button>
        <button className={styles.categoryActions} onClick={handleAddClick}>
          Add
        </button>
      </div>
      {showAddModal && (
        <AddCategoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleCreateCategory}
        />
      )}
    </div>
  );
};

export default CategoryList;
