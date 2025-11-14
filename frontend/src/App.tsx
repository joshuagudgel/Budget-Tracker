import React from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";

function App() {
  return (
    <div className="App">
      <h1>Budget Tracker</h1>
      <div className="Main-content">
        <ExpenseList />
      </div>
    </div>
  );
}

export default App;
