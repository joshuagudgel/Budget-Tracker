const API_BASE_URL = 'http://localhost:3000/api';

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

export const transactionService = {
  createTransaction: async (transaction: Omit<Transaction, '_id'>): Promise<Transaction> => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating transaction: ', error);
      throw error;
    }
  },
  getAllTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`);

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data: Transaction[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
  updateTransactions: async (transactions: Transaction[]): Promise<void> => {
    for (const transaction of transactions) {
      try {
        await fetch(`${API_BASE_URL}/transactions/${transaction._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });
      } catch (error) {
        console.error(`Error updating transaction with id ${transaction._id}: `, error);
      }
    }
  
  },
  deleteTransaction: async (transactionId: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Error deleting transaction with id ${transactionId}: `, error);
    }
  }
};

export interface Category {
  _id: string;
  name: string;
  displayName: string;
  color: string;
  budgetLimit: number;
  isActive: boolean;
};

type CreateCategoryRequest = Omit<Category, '_id' | 'isActive'>;

export const categoryService = {
  createCategory: async (category: CreateCategoryRequest): Promise<Category> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating category: ', error);
      throw error;
    }
  },
  getAllCategories: async (): Promise<Category[]> => {
    try{
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data: Category[] = await response.json();
      return data;
    }
    catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    };
  },
  updateCategories: async (categories: Category[]): Promise<void> => {
    for (const category of categories) {
      try {
        await fetch(`${API_BASE_URL}/categories/${category._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category)
        });
      } catch (error) {
        console.error(`Error updating category with id ${category._id}: `, error);
      }
    }
  },
  deleteCategory: async (categoryId: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Error deleting category with id ${categoryId}: `, error);
    }
  }
};