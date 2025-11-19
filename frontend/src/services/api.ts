const API_BASE_URL = 'http://localhost:3000/api';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

export const expenseService = {
  getAllExpenses: async (): Promise<Expense[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`);

      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data: Expense[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },
  updateExpenses: async (expenses: Expense[]): Promise<void> => {
    for (const expense of expenses) {
      try {
        await fetch(`${API_BASE_URL}/expenses/${expense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expense)
        });
      } catch (error) {
        console.error(`Error updating expense with id ${expense.id}: `, error);
      }
    }
  
  }
};