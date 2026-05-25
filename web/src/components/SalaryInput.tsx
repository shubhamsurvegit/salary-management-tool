import { DEFAULT_CURRENCY } from '@/lib/format';

type SalaryInputProps = {
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function SalaryInput({
  value,
  onChange,
  currency = DEFAULT_CURRENCY,
  placeholder = '500000',
  disabled = false,
}: SalaryInputProps) {
  return (
    <div className="salary-input">
      <span className="salary-input__currency">{currency}</span>
      <input
        type="number"
        min="0"
        className="salary-input__field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required
      />
    </div>
  );
}
