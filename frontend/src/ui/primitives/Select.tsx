const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = {
  /** Optional label shown above the select */
  label?: string
  /** Placeholder text for the empty option (when value is "") */
  placeholder?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /** Optional helper or hint text below the select */
  hint?: string
  /** Disable the entire select */
  disabled?: boolean
  /** Optional id for the native select (for label association) */
  id?: string
  /** Optional name for the native select */
  name?: string
  /** Additional class names for the wrapper (label + select + hint) */
  className?: string
  /** Additional class names for the select element only */
  selectClassName?: string
}

export default function Select({
  label,
  placeholder = 'Select…',
  value,
  onChange,
  options,
  hint,
  disabled = false,
  id,
  name,
  className = '',
  selectClassName = '',
}: SelectProps) {
  const selectId = id ?? (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label != null && label !== '' && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-lg pl-3 pr-9 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat disabled:opacity-50 disabled:cursor-not-allowed ${selectClassName}`}
        style={{ backgroundImage: chevronSvg }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
          >
            {opt.label}
          </option>
        ))}
      </select>
      {hint != null && hint !== '' && (
        <span className="text-xs text-gray-500">{hint}</span>
      )}
    </div>
  )
}
