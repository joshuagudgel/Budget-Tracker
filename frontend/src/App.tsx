import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import TransactionList from "./components/TransactionList";
import CategoryList from "./components/CategoryList";
import AnalysisView from "./components/AnalysisView";
import NavBar from "./components/NavBar";
import {
  transactionService,
  categoryService,
  Transaction,
  Category,
} from "./services/api";

function App() {
  const [currentView, setCurrentView] = useState<string>("Transactions");
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryData, transactionData] = await Promise.all([
          categoryService.getAllCategories(),
          transactionService.getAllTransactions(),
        ]);
        setCategories(categoryData);
        setTransactions(transactionData);
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

  const refreshTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to refresh transactions:", error);
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
        {currentView === "Transactions" && (
          <TransactionList
            categories={categories}
            transactions={transactions}
            onTransactionsUpdated={refreshTransactions}
          />
        )}
        {currentView === "Categories" && (
          <CategoryList
            categories={categories}
            onCategoriesUpdated={refreshCategories}
          />
        )}
        {currentView === "Analysis" && (
          <AnalysisView expenses={transactions} categories={categories} />
        )}
      </main>
    </div>
  );
}

export default App;
