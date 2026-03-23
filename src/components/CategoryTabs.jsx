import clsx from 'clsx';

export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <nav className="flex gap-3 overflow-x-auto pb-2" aria-label="Book categories">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={clsx(
            'min-h-[44px] whitespace-nowrap rounded-full px-5 py-3 text-base font-semibold transition-all duration-200',
            activeCategory === category.id
              ? 'bg-white text-brand-700 shadow-[0_12px_30px_rgba(255,183,3,0.28)]'
              : 'bg-white/60 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:bg-white'
          )}
        >
          {category.label}
        </button>
      ))}
    </nav>
  );
}
