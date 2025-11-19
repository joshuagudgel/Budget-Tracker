import React, { useState } from "react";
import styles from "./App.module.css";
import ExpenseList from "./components/ExpenseList";
import NavBar from "./components/NavBar";

function App() {
  const [currentView, setCurrentView] = useState<string>("Expenses");

  const handleViewChange = (nav: string) => {
    setCurrentView(nav);
  };

  return (
    <div className={styles.app}>
      <NavBar currentView={currentView} onNavigationChange={handleViewChange} />
      <main className={styles.mainContent}>
        {currentView === "Expenses" && <ExpenseList />}
        {currentView === "Categories" && <div>Categories View</div>}
      </main>
    </div>
  );
}

export default App;
