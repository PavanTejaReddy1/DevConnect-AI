export default function Avatar({ name, src, size = 'md', className = '', tone = 'from-primary to-accent' }) {
  const sizes = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl',
  };

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full border-2 border-white object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${tone} ${sizes[size]} font-semibold text-white ${className}`}
    >
      {initials || 'U'}
    </div>
  );
}
