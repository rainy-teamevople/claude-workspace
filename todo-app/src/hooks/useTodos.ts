import { useState, useCallback } from 'react';
import type { Todo, Priority, Filter } from '../types';

const STORAGE_KEY = 'executive-focus-todos';
const CATEGORIES_KEY = 'executive-focus-categories';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => load(STORAGE_KEY, []));
  const [categories, setCategories] = useState<string[]>(() =>
    load(CATEGORIES_KEY, ['업무', '개인', '학습'])
  );
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  // 함수형 업데이트로 stale closure 방지
  const persist = useCallback((updater: (prev: Todo[]) => Todo[]) => {
    setTodos(prev => {
      const next = updater(prev);
      save(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const addTodo = useCallback(
    (text: string, priority: Priority = 'medium', dueDate: string | null = null, category = '개인') => {
      if (!text.trim()) return;
      const next: Todo = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        priority,
        dueDate,
        category,
        createdAt: new Date().toISOString(),
      };
      persist(prev => [next, ...prev]);
    },
    [persist]
  );

  const updateTodo = useCallback(
    (id: string, changes: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
      persist(prev => prev.map(t => (t.id === id ? { ...t, ...changes } : t)));
    },
    [persist]
  );

  const deleteTodo = useCallback(
    (id: string) => persist(prev => prev.filter(t => t.id !== id)),
    [persist]
  );

  const toggleTodo = useCallback(
    (id: string) =>
      persist(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))),
    [persist]
  );

  const clearCompleted = useCallback(
    () => persist(prev => prev.filter(t => !t.completed)),
    [persist]
  );

  const addCategory = useCallback(
    (name: string) => {
      if (!name.trim()) return;
      setCategories(prev => {
        if (prev.includes(name.trim())) return prev;
        const next = [...prev, name.trim()];
        save(CATEGORIES_KEY, next);
        return next;
      });
    },
    []
  );

  const deleteCategory = useCallback((name: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c !== name);
      save(CATEGORIES_KEY, next);
      return next;
    });
  }, []);

  const isOverdue = (todo: Todo) =>
    !todo.completed && todo.dueDate !== null && new Date(todo.dueDate) < new Date();

  const filtered = todos
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter(t => !search || t.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
    overdue: todos.filter(isOverdue).length,
  };

  const upcoming = todos
    .filter(t => !t.completed && t.dueDate !== null)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  return {
    todos: filtered,
    upcoming,
    categories,
    filter,
    setFilter,
    search,
    setSearch,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    addCategory,
    deleteCategory,
    isOverdue,
    stats,
  };
}
