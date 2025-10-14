import React, { useCallback, useMemo, useState } from 'react';
import styles from './styles.module.css';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** 변형 스타일 */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 테마 */
  theme?: 'light' | 'dark';
  /** 체크 여부 (제어 컴포넌트) */
  checked?: boolean;
  /** 기본 체크 여부 (비제어) */
  defaultChecked?: boolean;
  /** 비활성화 */
  disabled?: boolean;
  /** 변경 이벤트 */
  onChange?: (checked: boolean) => void;
  /** 레이블 텍스트 (시각적/접근성) */
  label?: string;
}

/**
 * Toggle 컴포넌트
 * - variant/size/theme 시스템 지원
 * - 접근성: role="switch", aria-checked, 키보드 Space/Enter 토글
 */
export const Toggle: React.FC<ToggleProps> = ({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  label,
  className = '',
  onKeyDown,
  onClick,
  ...props
}) => {
  const isControlled = typeof checked === 'boolean';
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked ?? false);
  const isOn = isControlled ? (checked as boolean) : internalChecked;

  const rootClasses = [
    styles.toggle,
    styles[variant],
    styles[size],
    styles[theme],
    isOn && styles.checked,
    disabled && styles.disabled,
    className,
  ].filter(Boolean).join(' ');

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternalChecked(next);
    if (onChange) onChange(next);
  }, [disabled, isOn, isControlled, onChange]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    // toggle on primary click
    if (!e.defaultPrevented) handleToggle();
  }, [onClick, handleToggle]);

  const handleKey = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (onKeyDown) onKeyDown(e);
    if (e.defaultPrevented || disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  }, [onKeyDown, disabled, handleToggle]);

  const ariaLabel = useMemo(() => label ?? '토글', [label]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={ariaLabel}
      className={rootClasses}
      onClick={handleClick}
      onKeyDown={handleKey}
      disabled={disabled}
      {...props}
    >
      <span className={styles.track} aria-hidden>
        <span className={styles.thumb} />
      </span>
      {label && (
        <span className={styles.text}>
          {label}
        </span>
      )}
    </button>
  );
};

export default Toggle;


