type InputProps = {
  id: string
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}

export default function Input({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  required,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}

