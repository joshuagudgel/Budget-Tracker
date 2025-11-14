import React from "react";
import styles from "./App.module.css";
import ExpenseList from "./components/ExpenseList";

function App() {
  return (
    <div className={styles.App}>
      <h1>Budget Tracker</h1>
      <ExpenseList />
    </div>
  );
}

export default App;
