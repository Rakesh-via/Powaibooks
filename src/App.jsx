import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlarmClockCheck, Atom, Landmark, RefreshCw, SunMedium, Zap } from 'lucide-react';
import CategoryTabs from './components/CategoryTabs';
import BookCard from './components/BookCard';

const categoryMeta = {
  physics: { label: 'Physics', icon: Atom, accent: 'from-skyPop-300 to-skyPop-500' },
  'ancient-india-history': { label: 'History of Ancient India', icon: Landmark, accent: 'from-brand-300 to-brand-600' },
  'time-management': { label: 'Time Management', icon: AlarmClockCheck, accent: 'from-berry-300 to-berry-500' },
};

export default function App() {
  const [data, setData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('physics');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/books');
      setData(response.data);
    } catch (err) {
      setError('We could not load today\'s bright book list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const categories = useMemo(
    () => Object.entries(categoryMeta).map(([id, value]) => ({ id, label: value.label })),
    []
  );

  const activeBooks = data?.categories?.[activeCategory]?.books || [];
  const ActiveIcon = categoryMeta[activeCategory].icon;
  const activeTitle = data?.categories?.[activeCategory]?.title || categoryMeta[activeCategory].label;

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-5">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-300 via-brand-100 to-skyPop-100 p-6 shadow-[0_24px_60px_rgba(255,183,3,0.22)] md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-[1.4fr_0.8fr] md:items-center">
            <div className="space-y-4">
              <span className="inline-flex min-h-[44px] items-center rounded-full bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-berry-700">
                Popular books today
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
                Bright shelves for physics, ancient India, and smarter days.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
                Explore live book picks grouped into three colorful tabs. Each shelf highlights books readers are gravitating toward right now.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700">
                  <SunMedium className="h-4 w-4 text-brand-600" /> Bright visual theme
                </div>
                <div className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700">
                  <Zap className="h-4 w-4 text-berry-500" /> Live category shelves
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={loadBooks}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                >
                  <RefreshCw className="h-5 w-5" /> Refresh picks
                </button>
                <div className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white/80 px-5 py-3 text-base font-medium text-slate-700">
                  Updated {data ? new Date(data.updatedAt).toLocaleDateString() : 'live'}
                </div>
              </div>
            </div>
            <div className="rounded-[28px] bg-white/75 p-5 shadow-inner">
              <div className={`rounded-[24px] bg-gradient-to-br ${categoryMeta[activeCategory].accent} p-6 text-white shadow-lg`}>
                <ActiveIcon className="h-12 w-12" />
                <h2 className="mt-6 text-2xl font-bold">{activeTitle}</h2>
                <p className="mt-2 text-base text-white/90">
                  Switch tabs to browse a vivid mix of foundational science, ancient Indian history, and practical productivity reads.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="space-y-5 rounded-[32px] bg-white/60 p-4 shadow-[0_18px_50px_rgba(219,39,119,0.12)] backdrop-blur md:p-6">
          <CategoryTabs categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />

          <div className="flex flex-col gap-2 rounded-[24px] bg-gradient-to-r from-white to-brand-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-berry-600">Current shelf</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">{activeTitle}</h3>
            </div>
            <p className="text-base text-slate-600">
              {activeBooks.length} popular books loaded for this tab.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-[28px] bg-white p-5 shadow-sm">
                  <div className="aspect-[4/3] rounded-[20px] bg-brand-50" />
                  <div className="mt-4 h-4 w-20 rounded bg-slate-100" />
                  <div className="mt-3 h-6 w-3/4 rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 rounded bg-slate-100" />
                    <div className="h-4 rounded bg-slate-100" />
                    <div className="h-4 w-5/6 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[28px] bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{error}</p>
              <button
                type="button"
                onClick={loadBooks}
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-berry-500 px-6 py-3 text-base font-semibold text-white transition hover:brightness-110"
              >
                Try again
              </button>
            </div>
          ) : activeBooks.length === 0 ? (
            <div className="rounded-[28px] bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No books found in this category yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeBooks.map((book, index) => (
                <BookCard key={book.sourceKey} book={book} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
