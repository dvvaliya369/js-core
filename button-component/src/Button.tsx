import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** The visual variant of the button */
  variant?: ButtonVariant;
  /** The size of the button */
  size?: ButtonSize;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Custom class name */
  className?: string;
  /** Button content */
  children: React.ReactNode;
}

/**
 * A flexible and customizable Button component
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;
    const loadingClass = loading ? 'btn--loading' : '';
    const disabledClass = disabled ? 'btn--disabled' : '';

    const classes = [
      baseClass,
      variantClass,
      sizeClass,
      loadingClass,
      disabledClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="btn__spinner" aria-hidden="true">
            ⟳
          </span>
        )}
        <span className={loading ? 'btn__content--loading' : 'btn__content'}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
