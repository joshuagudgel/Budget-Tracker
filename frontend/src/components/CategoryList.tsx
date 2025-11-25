import { useState, useEffect } from "react";
import { Category, categoryService } from "../services/api";
import styles from "./CategoryList.module.css";

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);
  const [changedCategoryIds, setChangedCategoryIds] = useState<string[]>([]);
  const categoryHeaders = ["Name", "Display Name", "Color", "Budget Limit"];

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
      console.log("Successfully saved changes");
    } catch (error) {
      console.error("Error saving changes:", error);
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
                <td>{category.name}</td>
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
                <td>{category.color}</td>
                <td>{category.budgetLimit}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
};

export default CategoryList;
