import react, { useState, useEffect } from "react";
import { Category, categoryService } from "../services/api";
import styles from "./CategoryList.module.css";

interface CategoryListProps {
  categories?: Category[];
}

const CategoryList: React.FC<CategoryListProps> = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryHeaders] = useState<string[]>([
    "Name",
    "Display Name",
    "Color",
    "Budget Limit",
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className={styles.categoryList}>
      <h2>Categories</h2>
      <table>
        <thead>
          <tr>
            {categoryHeaders.map((header) => (
              <th key={header.toLowerCase()}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3}>No categories found</td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.displayName}</td>
                <td>{category.color}</td>
                <td>{category.budgetLimit}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
