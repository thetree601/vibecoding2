import React from 'react';
import styles from './styles.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 입력 필드의 변형 스타일
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 입력 필드의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
  
  /**
   * placeholder 텍스트
   */
  placeholder?: string;
  
  /**
   * 입력 값
   */
  value?: string;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 값 변경 이벤트 핸들러
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * 포커스 이벤트 핸들러
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  /**
   * 블러 이벤트 핸들러
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  /**
   * 에러 상태
   */
  error?: boolean;
  
  /**
   * 입력 타입
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
}

/**
 * Input 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 입력 필드 컴포넌트입니다.
 * variant, size, theme 시스템을 지원합니다.
 * 
 * @example
 * ```tsx
 * <Input 
 *   variant="primary" 
 *   size="medium" 
 *   theme="light"
 *   placeholder="텍스트를 입력해주세요"
 *   value={value}
 *   onChange={handleChange}
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  placeholder = '',
  value,
  disabled = false,
  error = false,
  onChange,
  onFocus,
  onBlur,
  type = 'text',
  className = '',
  ...props
}) => {
  const inputClasses = [
    styles.input,
    styles[variant],
    styles[size],
    styles[theme],
    disabled && styles.disabled,
    error && styles.error,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      className={inputClasses}
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    />
  );
};

export default Input;
