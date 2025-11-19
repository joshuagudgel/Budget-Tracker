const API_BASE_URL = 'http://localhost:3000/api';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
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
  }
};