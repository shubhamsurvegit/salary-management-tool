import { COUNTRIES } from '@/constants/countries';

type CountrySelectProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
};

export function CountrySelect({
  value,
  onChange,
  disabled = false,
  id,
}: CountrySelectProps) {
  return (
    <select
      id={id}
      className="select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      required
    >
      <option value="" disabled>
        Select country
      </option>
      {COUNTRIES.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}
