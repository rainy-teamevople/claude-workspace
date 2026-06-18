import { useState } from 'react';
import './styles/variables.css';
import { useTodos } from './hooks/useTodos';
import { useTheme } from './hooks/useTheme';
import type { Todo } from './types';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TodoInput from './components/TodoInput';
import TaskArticle from './components/TaskArticle';
import Sidebar from './components/Sidebar';
import EditModal from './components/EditModal';

export default function App() {
  const { theme, toggle } = useTheme();
  const {
    todos, upcoming, categories, filter, setFilter, search, setSearch,
    addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted,
    addCategory, deleteCategory, isOverdue, stats,
  } = useTodos();

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  return (
    <div className="app" style={{ maxWidth: 1280, margin: '0 auto' }}>
      <Header
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        theme={theme}
        onToggleTheme={toggle}
        stats={stats}
      />

      <HeroSection stats={stats} />

      <TodoInput onAdd={addTodo} categories={categories} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', minHeight: '60vh' }}>
        {/* Left: Task Articles */}
        <main aria-label="할 일 목록">
          {todos.length === 0 ? (
            <div style={{
              padding: '96px 48px',
              textAlign: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: 24,
              color: 'var(--color-text-muted)',
            }}>
              할 일이 없어요.<br />
              <span style={{ fontSize: 14, fontFamily: 'var(--font-sans)', marginTop: 8, display: 'block' }}>
                위 입력창에서 새 할 일을 추가해보세요.
              </span>
            </div>
          ) : (
            todos.map(todo => (
              <TaskArticle
                key={todo.id}
                todo={todo}
                isOverdue={isOverdue(todo)}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={setEditingTodo}
              />
            ))
          )}
        </main>

        {/* Right: Sidebar */}
        <Sidebar
          stats={stats}
          upcoming={upcoming}
          categories={categories}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onClearCompleted={clearCompleted}
        />
      </div>

      {/* Edit Modal */}
      {editingTodo && (
        <EditModal
          todo={editingTodo}
          categories={categories}
          onSave={updateTodo}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}
