export const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Other'] as const;

export type Category = (typeof categories)[number];

export type Expense = {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO string
  note?: string;
};
