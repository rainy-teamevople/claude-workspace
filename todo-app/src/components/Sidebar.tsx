import { useState } from 'react';
import type { Todo } from '../types';
import './Sidebar.css';

interface Props {
  stats: { total: number; active: number; completed: number; overdue: number };
  upcoming: Todo[];
  categories: string[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  onClearCompleted: () => void;
}

export default function Sidebar({ stats, upcoming, categories, onAddCategory, onDeleteCategory, onClearCompleted }: Props) {
  const [newCat, setNewCat] = useState('');
  const now = new Date();

  const formatUpcomingDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' });

  return (
    <aside className="sidebar" aria-label="사이드바">
      {/* Navigation Index */}
      <div className="sidebar__index">
        <p className="sidebar__section-title">현황</p>
        {[
          { label: '전체', count: stats.total },
          { label: '진행중', count: stats.active },
          { label: '완료', count: stats.completed },
          { label: '기한 초과', count: stats.overdue },
        ].map(item => (
          <div key={item.label} className="sidebar__index-item">
            <span>{item.label}</span>
            <span className="sidebar__index-count">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Typographic Calendar */}
      <div className="sidebar__calendar" aria-label="오늘 날짜">
        <p className="sidebar__calendar-month">
          {now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
        </p>
        <p className="sidebar__calendar-day">{String(now.getDate()).padStart(2, '0')}</p>
        <p className="sidebar__calendar-weekday">
          {now.toLocaleDateString('ko-KR', { weekday: 'long' })}
        </p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="sidebar__upcoming" aria-label="마감 예정">
          <p className="sidebar__section-title">마감 예정</p>
          {upcoming.slice(0, 5).map(todo => (
            <div key={todo.id} className="sidebar__upcoming-item">
              <span className="sidebar__upcoming-date">
                {todo.dueDate ? formatUpcomingDate(todo.dueDate) : ''}
              </span>
              <span className="sidebar__upcoming-text">{todo.text}</span>
              <span className={`sidebar__upcoming-badge sidebar__upcoming-badge--${todo.priority}`}>
                {todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '보통' : '낮음'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Category Manager */}
      <div className="sidebar__categories" aria-label="카테고리 관리">
        <p className="sidebar__section-title">카테고리</p>
        <div className="sidebar__cat-list">
          {categories.map(c => (
            <span key={c} className="sidebar__cat-tag">
              {c}
              <button onClick={() => onDeleteCategory(c)} aria-label={`${c} 삭제`}>×</button>
            </span>
          ))}
        </div>
        <div className="sidebar__cat-input-row">
          <input
            className="sidebar__cat-input"
            type="text"
            placeholder="새 카테고리..."
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { onAddCategory(newCat); setNewCat(''); }
            }}
            aria-label="새 카테고리 이름"
          />
          <button
            className="sidebar__cat-btn"
            onClick={() => { onAddCategory(newCat); setNewCat(''); }}
            aria-label="카테고리 추가"
          >
            +
          </button>
        </div>
        {stats.completed > 0 && (
          <button className="sidebar__clear-btn" onClick={onClearCompleted}>
            완료 항목 일괄 삭제 ({stats.completed})
          </button>
        )}
      </div>
    </aside>
  );
}
