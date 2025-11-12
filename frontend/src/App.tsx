import React from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ExpenseList />
      </header>
    </div>
  );
}

export default App;
