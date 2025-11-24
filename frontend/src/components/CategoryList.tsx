import { Category } from "../services/api";
import styles from "./CategoryList.module.css";

interface CategoryListProps {
  categories: Category[];
}

const handleEditClick = () => {
  console.log("Edit button clicked");
};

const handleSaveClick = () => {
  console.log("Save button clicked");
};

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const categoryHeaders = ["Name", "Display Name", "Color", "Budget Limit"];

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
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.displayName}</td>
                <td>{category.color}</td>
                <td>{category.budgetLimit}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button onClick={handleEditClick}>Edit</button>
      <button onClick={handleSaveClick}>Save</button>
    </div>
  );
};

export default CategoryList;
