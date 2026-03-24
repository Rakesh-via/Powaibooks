import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Sparkles, Star } from 'lucide-react';

const MotionArticle = motion.article;

export default function BookCard({ book, index }) {
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="overflow-hidden rounded-[28px] bg-white/90 shadow-[0_18px_45px_rgba(56,189,248,0.16)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(56,189,248,0.22)]"
    >
      <a
        href={book.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${book.title} on ${book.externalSource}`}
        className="block focus:outline-none focus:ring-4 focus:ring-brand-200"
      >
        <div className="aspect-[4/3] overflow-hidden bg-brand-50">
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        </div>
      </a>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-berry-500">{book.year || 'Classic'}</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              <a
                href={book.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm transition hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                {book.title}
              </a>
            </h3>
            <p className="mt-1 text-base text-slate-600">{book.author}</p>
          </div>
          <div className="flex min-w-[44px] items-center gap-1 rounded-full bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
            <Star className="h-4 w-4 fill-current" />
            {book.rating}
          </div>
        </div>
        <p className="line-clamp-4 text-base leading-relaxed text-slate-600">{book.description}</p>
        <div className="flex flex-wrap gap-2 text-sm font-medium text-skyPop-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-skyPop-100 px-3 py-2">
            <BookOpen className="h-4 w-4" /> Trending read
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-berry-100 px-3 py-2 text-berry-700">
            <Sparkles className="h-4 w-4" /> Bright pick
          </span>
          <a
            href={book.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-100 px-3 py-2 text-brand-800 transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label={`Open ${book.title} on ${book.externalSource}`}
          >
            <ExternalLink className="h-4 w-4" /> {book.externalSource}
          </a>
        </div>
      </div>
    </MotionArticle>
  );
}
