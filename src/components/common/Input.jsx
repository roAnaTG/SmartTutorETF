const Input = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error, 
  icon: Icon,
  className = '',
  rows // for textarea
}) => {
  const inputStyles = `w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium placeholder:text-slate-400 ${Icon ? 'pl-12' : ''} ${error ? 'border-rose-500' : ''}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${error ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
        )}
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows || 3}
            className={`${inputStyles} resize-none`}
          />
        ) : (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={inputStyles}
          />
        )}
      </div>
      {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
