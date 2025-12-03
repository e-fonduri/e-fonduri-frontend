import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  fullWidth = false,
  href,
}: ButtonProps) {
  const baseClasses = `
    px-6 py-3 rounded-lg font-medium transition-all duration-200
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl
      ${disabled ? '' : 'active:scale-[0.98]'}
    `,
    secondary: `
      border-2 border-zinc-300 dark:border-zinc-700
      hover:bg-zinc-100 dark:hover:bg-zinc-800
      text-zinc-900 dark:text-zinc-100
      ${disabled ? '' : 'active:scale-[0.98]'}
    `,
  };

  const className = `${baseClasses} ${variantClasses[variant]}`.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}
