import './HeroSection.css';

interface Props {
  stats: { total: number; active: number; completed: number; overdue: number };
}

export default function HeroSection({ stats }: Props) {
  const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} PRODUCTIVITY`;

  return (
    <section className="hero" aria-label="대시보드 요약">
      <div className="hero__watermark" aria-hidden="true">{quarter}</div>
      <div className="hero__content">
        <p className="hero__label">대시보드 · {new Date().getFullYear()}</p>
        <div className="hero__stats" role="status" aria-label="할 일 통계">
          <div className="hero__stat">
            <span className="hero__stat-value">{stats.total}</span>
            <span className="hero__stat-label">전체</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">{stats.active}</span>
            <span className="hero__stat-label">진행중</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">{stats.completed}</span>
            <span className="hero__stat-label">완료</span>
          </div>
          {stats.overdue > 0 && (
            <div className="hero__stat">
              <span className="hero__stat-value hero__stat-value--accent">{stats.overdue}</span>
              <span className="hero__stat-label">기한 초과</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
