// RoamTassie logo variants. The mark is an original geometric composition:
// a stylized "R" whose counter doubles as a mountain silhouette with a horizon line.
// Three variants: mark-lockup (icon + wordmark), badge (circular seal), monogram.

function LogoMark({ variant = 'default', size = 34 }) {
  if (variant === 'monogram') {
    return (
      <svg className="logo-mark" width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="1" y="1" width="38" height="38" rx="10" fill="var(--brand)" />
        <path d="M11 12h10.5c3.6 0 6 2.2 6 5.4 0 2.4-1.4 4.3-3.7 5L28 29h-4.1l-4-6h-4.4v6H11V12zm4.5 3.6v4.4H21c1.6 0 2.6-.9 2.6-2.2s-1-2.2-2.6-2.2h-5.5z"
          fill="var(--brand-ink)" />
        <circle cx="30" cy="13" r="2.5" fill="var(--accent)" />
      </svg>
    );
  }
  if (variant === 'badge') {
    return (
      <svg className="logo-mark" width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="var(--brand)" />
        <circle cx="20" cy="20" r="16" fill="none" stroke="var(--accent)" strokeWidth="0.8" strokeDasharray="1 2" />
        {/* Mountain horizon */}
        <path d="M8 25l5-7 4 4 5-8 5 6 5-4v9H8z" fill="var(--accent)" />
        <circle cx="28" cy="13" r="2" fill="var(--bg)" opacity="0.9" />
        <line x1="8" y1="27.5" x2="32" y2="27.5" stroke="var(--bg)" strokeWidth="0.6" opacity="0.5" />
      </svg>
    );
  }
  // default: R-mountain mark
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="1" y="1" width="38" height="38" rx="10" fill="var(--brand)" />
      {/* Mountain peaks forming abstract R counter */}
      <path d="M7 28l6-10 4 5 4-8 5 7 4-3 3 3v6H7z" fill="var(--accent)" opacity="0.95"/>
      {/* Horizon line */}
      <line x1="7" y1="28.5" x2="33" y2="28.5" stroke="var(--bg)" strokeWidth="0.8" opacity="0.6" />
      {/* R stem */}
      <rect x="9" y="10" width="3" height="13" fill="var(--brand-ink)" />
      {/* R bowl */}
      <path d="M12 10h7c2.6 0 4.5 1.8 4.5 4.2S21.6 18.4 19 18.4h-7v-2.6h6.6c1.2 0 1.9-.7 1.9-1.6s-.7-1.6-1.9-1.6H12v-2.6z" fill="var(--brand-ink)" />
      {/* Sun/dot accent */}
      <circle cx="28" cy="11" r="2.2" fill="var(--accent)" />
    </svg>
  );
}

function Logo({ variant = 'default', size = 34, showText = true }) {
  return (
    <a href="#" className="logo" aria-label="RoamTassie home">
      <LogoMark variant={variant} size={size} />
      {showText && (
        <span className="logo-text">
          Roam<span className="tail">Tassie</span>
        </span>
      )}
    </a>
  );
}

window.Logo = Logo;
window.LogoMark = LogoMark;
