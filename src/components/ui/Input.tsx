import FormError from './FormError';

interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  id: string;
}

export default function Input({
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  autoComplete,
  id,
}: InputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`
          w-full px-4 py-3 rounded-lg border transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${
            error
              ? 'border-red-500 dark:border-red-400'
              : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
          }
          text-zinc-900 dark:text-zinc-100
          placeholder:text-zinc-400 dark:placeholder:text-zinc-500
        `}
      />
      <FormError message={error} />
    </div>
  );
}
