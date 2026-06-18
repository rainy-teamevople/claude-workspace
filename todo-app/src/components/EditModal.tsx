import { useState } from 'react';
import type { Todo, Priority } from '../types';
import './EditModal.css';

interface Props {
  todo: Todo;
  categories: string[];
  onSave: (id: string, changes: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onClose: () => void;
}

export default function EditModal({ todo, categories, onSave, onClose }: Props) {
  const [text, setText] = useState(todo.text);
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [dueDate, setDueDate] = useState(todo.dueDate ?? '');
  const [category, setCategory] = useState(todo.category);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(todo.id, { text: text.trim(), priority, dueDate: dueDate || null, category });
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="할 일 수정">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">할 일 수정</h2>
          <button className="modal__close" onClick={onClose} aria-label="닫기">×</button>
        </div>

        <div className="modal__body">
          <div className="modal__field">
            <label className="modal__label" htmlFor="edit-text">내용</label>
            <input
              id="edit-text"
              className="modal__input"
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="edit-priority">우선순위</label>
            <select
              id="edit-priority"
              className="modal__select"
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
            >
              <option value="high">🔴 높음</option>
              <option value="medium">🟡 보통</option>
              <option value="low">🟢 낮음</option>
            </select>
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="edit-category">카테고리</label>
            <select
              id="edit-category"
              className="modal__select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="edit-date">마감일</label>
            <input
              id="edit-date"
              className="modal__date"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="modal__footer">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>취소</button>
          <button className="modal__btn modal__btn--save" onClick={handleSave} disabled={!text.trim()}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
