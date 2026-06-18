import type { Todo } from '../types';
import './TaskArticle.css';

interface Props {
  todo: Todo;
  isOverdue: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  high: 'URGENT',
  medium: 'TODAY',
  low: 'UPCOMING',
};

export default function TaskArticle({ todo, isOverdue, onToggle, onDelete, onEdit }: Props) {
  const label = isOverdue ? 'OVERDUE' : todo.completed ? 'COMPLETED' : PRIORITY_LABELS[todo.priority];

  const classes = [
    'article',
    todo.completed ? 'article--completed' : '',
    isOverdue ? 'article--overdue' : '',
  ].filter(Boolean).join(' ');

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });

  return (
    <article className={classes} aria-label={`할 일: ${todo.text}`}>
      <div className="article__meta">
        <span className="article__label">{label}</span>
        <span
          className={`article__priority-dot article__priority-dot--${todo.priority}`}
          aria-label={`우선순위: ${todo.priority}`}
        />
        <span className="article__category">{todo.category}</span>
        {todo.dueDate && (
          <span className={`article__date${isOverdue ? ' article__date--overdue' : ''}`}>
            {isOverdue ? '⚠ ' : ''}
            {formatDate(todo.dueDate)}
          </span>
        )}
      </div>

      <div className="article__body">
        <input
          className="article__checkbox"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`${todo.text} 완료 처리`}
        />
        <h2 className="article__title">{todo.text}</h2>
      </div>

      <div className="article__actions">
        <button onClick={() => onEdit(todo)} aria-label="수정">수정</button>
        <button className="article__btn-delete" onClick={() => onDelete(todo.id)} aria-label="삭제">삭제</button>
      </div>
    </article>
  );
}
