import { useState } from 'react';
import type { Priority } from '../types';
import './TodoInput.css';

interface Props {
  onAdd: (text: string, priority: Priority, dueDate: string | null, category: string) => void;
  categories: string[];
}

export default function TodoInput({ onAdd, categories }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(categories[0] ?? '개인');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, dueDate || null, category);
    setText('');
    setDueDate('');
  };

  return (
    <div className="todo-input">
      <form className="todo-input__form" onSubmit={handleSubmit} aria-label="새 할 일 추가">
        <input
          className="todo-input__text"
          type="text"
          placeholder="새 할 일을 입력하세요..."
          value={text}
          onChange={e => setText(e.target.value)}
          aria-label="할 일 내용"
        />
        <select
          className="todo-input__select"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          aria-label="우선순위"
        >
          <option value="high">🔴 높음</option>
          <option value="medium">🟡 보통</option>
          <option value="low">🟢 낮음</option>
        </select>
        <select
          className="todo-input__select"
          value={category}
          onChange={e => setCategory(e.target.value)}
          aria-label="카테고리"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          className="todo-input__date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          aria-label="마감일"
          min={new Date().toISOString().split('T')[0]}
        />
        <button
          className="todo-input__submit"
          type="submit"
          disabled={!text.trim()}
          aria-label="추가"
        >
          + 추가
        </button>
      </form>
    </div>
  );
}
