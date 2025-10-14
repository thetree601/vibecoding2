import React from 'react';
import styles from './styles.module.css';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'disabled'> {
  /**
   * 버튼의 변형 스타일
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 버튼의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
  
  /**
   * 버튼 내용
   */
  children: React.ReactNode;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /**
   * 버튼 타입
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 버튼 컴포넌트입니다.
 * variant, size, theme 시스템을 지원합니다.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" theme="light">
 *   버튼 텍스트
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  children,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    styles[theme],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
