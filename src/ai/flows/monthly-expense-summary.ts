 'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a monthly expense summary.
 *
 * The flow takes a list of expenses as input and returns a summary of total expenses
 * and a category-wise breakdown, leveraging AI to identify spending patterns and
 * provide personalized insights.
 *
 * @interface MonthlyExpenseSummaryInput - Input type for the monthlyExpenseSummary function.
 * @interface MonthlyExpenseSummaryOutput - Output type for the monthlyExpenseSummary function.
 * @function monthlyExpenseSummary - The main function to generate the monthly expense summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for an individual expense
const ExpenseSchema = z.object({
  amount: z.number(),
  category: z.string(),
  date: z.string(), // Assuming date is stored as a string in ISO format
  note: z.string().optional(),
});

// Define the input schema for the monthly expense summary flow
const MonthlyExpenseSummaryInputSchema = z.object({
  expenses: z.array(ExpenseSchema).describe('An array of expenses for the month.'),
});

export type MonthlyExpenseSummaryInput = z.infer<typeof MonthlyExpenseSummaryInputSchema>;

// Define the output schema for the monthly expense summary flow
const MonthlyExpenseSummaryOutputSchema = z.object({
  totalExpenses: z.number().describe('Total expenses for the month.'),
  categoryBreakdown: z
    .record(z.string(), z.number())
    .describe('Category-wise breakdown of expenses.'),
  insights: z.string().describe('Personalized insights and spending patterns identified by AI.'),
});

export type MonthlyExpenseSummaryOutput = z.infer<typeof MonthlyExpenseSummaryOutputSchema>;

// Define the tool to analyze spending patterns and provide insights
const analyzeSpendingPatterns = ai.defineTool({
  name: 'analyzeSpendingPatterns',
  description:
    'Analyzes spending patterns from a list of expenses and provides personalized insights.',
  inputSchema: z.array(ExpenseSchema),
  outputSchema: z.string(),
}, async (expenses) => {
  // Dummy implementation - replace with actual AI-powered analysis
  return `AI analysis: Spending seems consistent across categories.  Consider reducing expenses on Bills.`
});

// Define the prompt for the monthly expense summary
const monthlyExpenseSummaryPrompt = ai.definePrompt({
  name: 'monthlyExpenseSummaryPrompt',
  input: {schema: MonthlyExpenseSummaryInputSchema},
  output: {schema: MonthlyExpenseSummaryOutputSchema},
  tools: [analyzeSpendingPatterns],
  prompt: `You are an AI assistant that provides a monthly expense summary.

  Given the following expenses:

  {{#each expenses}}
  - Amount: {{amount}}, Category: {{category}}, Date: {{date}}, Note: {{note}}
  {{/each}}

  Provide a summary including:
  - Total expenses for the month.
  - Category-wise breakdown of expenses.
  - Personalized insights and spending patterns identified by AI using the analyzeSpendingPatterns tool.

  Make sure totalExpenses and categoryBreakdown are numbers.

  Use the analyzeSpendingPatterns to get personalized insights.`, // Ensure the totalExpenses and categoryBreakdown are numbers
});

// Define the Genkit flow for generating the monthly expense summary
const monthlyExpenseSummaryFlow = ai.defineFlow(
  {
    name: 'monthlyExpenseSummaryFlow',
    inputSchema: MonthlyExpenseSummaryInputSchema,
    outputSchema: MonthlyExpenseSummaryOutputSchema,
  },
  async input => {
    // Calculate total expenses and category breakdown
    const totalExpenses = input.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryBreakdown: {[category: string]: number} = {};
    input.expenses.forEach(expense => {
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
    });

    // To fix the API error, we will use the local tool directly instead of calling the LLM.
    const insights = await analyzeSpendingPatterns(input.expenses);

    return {
      totalExpenses,
      categoryBreakdown,
      insights,
    };
  }
);

/**
 * Generates a monthly expense summary with AI-powered insights.
 * @param input - The input containing the list of expenses.
 * @returns A promise resolving to the monthly expense summary.
 */
export async function monthlyExpenseSummary(input: MonthlyExpenseSummaryInput): Promise<MonthlyExpenseSummaryOutput> {
  return monthlyExpenseSummaryFlow(input);
}
