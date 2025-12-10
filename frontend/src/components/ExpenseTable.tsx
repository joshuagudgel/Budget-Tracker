import React from "react";
import { Category } from "../services/api";
import styles from "./ExpenseTable.module.css";

interface MonthlyData {
  month: string;
  total: number;
  [categoryName: string]: string | number;
}

interface ExpenseTableProps {
  data: MonthlyData[];
  categories: Category[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ data, categories }) => {
  const columnTotals = React.useMemo(() => {
    const totals: Record<string, number> = {
      total: 0,
    };

    categories.forEach((category) => {
      totals[category.name] = 0;
    });

    data.forEach((row) => {
      totals.total += row.total;
      categories.forEach((category) => {
        totals[category.name] += (row[category.name] as number) || 0;
      });
    });

    return totals;
  }, [data, categories]);

  return (
    <div className={styles.tableContainer}>
      <h3>Monthly Expense Breakdown</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.expenseTable}>
          <thead>
            <tr>
              <th className={styles.monthHeader}>Month</th>
              <th className={styles.totalHeader}>Total</th>
              {categories.map((category) => (
                <th key={category._id} className={styles.categoryHeader}>
                  {category.displayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={styles.dataRow}>
                <td className={styles.monthCell}>{row.month}</td>
                <td className={styles.totalCell}>${row.total.toFixed(2)}</td>
                {categories.map((category) => (
                  <td key={category._id} className={styles.categoryCell}>
                    ${((row[category.name] as number) || 0).toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <td className={styles.totalLabel}>Totals</td>
              <td className={styles.grandTotal}>
                ${columnTotals.total.toFixed(2)}
              </td>
              {categories.map((category) => (
                <td key={category._id} className={styles.categoryTotal}>
                  ${columnTotals[category.name].toFixed(2)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
