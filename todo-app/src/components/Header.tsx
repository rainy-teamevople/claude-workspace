import type { Filter, Theme } from '../types';
import './Header.css';

interface Props {
  filter: Filter;
  setFilter: (f: Filter) => void;
  search: string;
  setSearch: (s: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  stats: { total: number; active: number; completed: number; overdue: number };
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'active', label: 'ACTIVE' },
  { key: 'completed', label: 'DONE' },
];

export default function Header({ filter, setFilter, search, setSearch, theme, onToggleTheme, stats }: Props) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });

  return (
    <header className="header" role="banner">
      <div className="header__left">
        <h1 className="header__logo">
          EXECUTIVE <span>FOCUS</span>
        </h1>
        <nav className="header__nav" aria-label="필터 내비게이션">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`header__nav-link${filter === f.key ? ' header__nav-link--active' : ''}`}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
            >
              {f.label}
              {f.key === 'active' && stats.overdue > 0 && (
                <span style={{ color: 'var(--color-overdue)', marginLeft: 6 }}>
                  ({stats.overdue} 초과)
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="header__right">
        <div className="header__controls">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`header__filter-btn${filter === f.key ? ' header__filter-btn--active' : ''}`}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="header__meta">
          <div className="header__search">
            <input
              className="header__search-input"
              type="search"
              placeholder="검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="할 일 검색"
            />
          </div>
          <span className="header__date" aria-label="오늘 날짜">{today}</span>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {theme === 'dark' ? '☀' : '◑'}
          </button>
        </div>
      </div>
    </header>
  );
}
