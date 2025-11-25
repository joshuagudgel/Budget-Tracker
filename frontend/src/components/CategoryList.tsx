import { useState, useEffect } from "react";
import { Category, categoryService } from "../services/api";
import styles from "./CategoryList.module.css";

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
  const categoryHeaders = ["Name", "Display Name", "Color", "Budget Limit"];
  const [newCategory, setNewCategory] = useState({
    name: "",
    displayName: "",
    color: "",
    budgetLimit: 0,
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleCategoryChange = (
    categoryId: string,
    field: string,
    value: any
  ) => {
    console.log(`Category ${categoryId} changed: ${field} = ${value}`);
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
      // collect changed categories
      const changedCategories = localCategories.filter((category) =>
        changedCategoryIds.includes(category._id)
      );

      if (changedCategories.length === 0) {
        console.log("No changes to save");
        return;
      }
      // call API for each expense that was changed
      await categoryService.updateCategories(changedCategories);

      // clear changedCategoryIds after successful save
      setChangedCategoryIds([]);
      onCategoriesUpdated?.();

      console.log("Successfully saved changes");
      alert("Categories saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCreateCategory = async () => {
    if (
      !newCategory.name ||
      !newCategory.displayName ||
      !newCategory.color ||
      !newCategory.budgetLimit
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await categoryService.createCategory(newCategory);

      onCategoriesUpdated?.();

      setShowAddForm(false);
      setNewCategory({
        name: "",
        displayName: "",
        color: "",
        budgetLimit: 0,
      });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className={styles.categoryList}>
      <h2>Categories</h2>
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
              <tr key={category._id}>
                <td>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      handleCategoryChange(category._id, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
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
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button onClick={handleSaveClick}>Save</button>
      <button onClick={handleAddClick}>Add</button>
      {showAddForm && (
        <div className={styles.addCategoryForm}>
          <h3>Add New Category</h3>
          <input
            type="text"
            placeholder="Name"
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
            placeholder="Color"
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
          <button onClick={handleCreateCategory}>Create</button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
