import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import ExpenseList from "./components/ExpenseList";
import CategoryList from "./components/CategoryList";
import NavBar from "./components/NavBar";
import {
  expenseService,
  categoryService,
  Expense,
  Category,
} from "./services/api";

function App() {
  const [currentView, setCurrentView] = useState<string>("Expenses");
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryData, expenseData] = await Promise.all([
          categoryService.getAllCategories(),
          expenseService.getAllExpenses(),
        ]);
        setCategories(categoryData);
        setExpenses(expenseData);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to refresh categories:", error);
    }
  };

  const refreshExpenses = async () => {
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to refresh expenses:", error);
    }
  };

  const handleViewChange = (nav: string) => {
    setCurrentView(nav);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.app}>
      <NavBar currentView={currentView} onNavigationChange={handleViewChange} />
      <main className={styles.mainContent}>
        {currentView === "Expenses" && (
          <ExpenseList
            categories={categories}
            expenses={expenses}
            onExpensesUpdated={refreshExpenses}
          />
        )}
        {currentView === "Categories" && (
          <CategoryList
            categories={categories}
            onCategoriesUpdated={refreshCategories}
          />
        )}
      </main>
    </div>
  );
}

export default App;
