import './StatusBadge.css';

export type StatusVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'pending'
  | 'neutral';

export type StatusSize = 'small' | 'medium' | 'large';

export interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: StatusSize;
  dot?: boolean;
  pill?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function StatusBadge({
  label,
  variant = 'neutral',
  size = 'medium',
  dot = false,
  pill = false,
  className = '',
  onClick
}: StatusBadgeProps) {
  return (
    <span
      className={`
        status-badge 
        status-${variant} 
        size-${size} 
        ${dot ? 'with-dot' : ''} 
        ${pill ? 'pill' : ''} 
        ${onClick ? 'clickable' : ''} 
        ${className}
      `}
      onClick={onClick}
    >
      {dot && <span className="status-dot" />}
      <span className="status-label">{label}</span>
    </span>
  );
}
