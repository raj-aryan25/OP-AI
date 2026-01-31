import type { ReactNode } from 'react';
import './MetricCard.css';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode | string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  unit?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  onClick?: () => void;
  className?: string;
  footer?: ReactNode;
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  unit,
  color = 'blue',
  onClick,
  className = '',
  footer
}: MetricCardProps) {
  return (
    <div
      className={`metric-card metric-card-${color} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {icon && (
          <div className="metric-icon">
            {typeof icon === 'string' ? <span>{icon}</span> : icon}
          </div>
        )}
      </div>

      <div className="metric-body">
        <div className="metric-value-container">
          <span className="metric-value">{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>

        {trend && (
          <div className={`metric-trend trend-${trend.direction}`}>
            <span className="trend-arrow">
              {trend.direction === 'up' ? '↑' : '↓'}
            </span>
            <span className="trend-value">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {footer && <div className="metric-footer">{footer}</div>}
    </div>
  );
}
