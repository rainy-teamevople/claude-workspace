export type Priority = 'high' | 'medium' | 'low';
export type Filter = 'all' | 'active' | 'completed';
export type Theme = 'dark' | 'light';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  category: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}
