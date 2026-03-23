import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const categoryConfigs = {
  physics: {
    title: 'Physics',
    subjects: ['physics', 'quantum physics', 'astrophysics'],
  },
  time: {
    title: 'Time',
    subjects: ['time', 'space and time', 'time perception'],
  },
  'time-management': {
    title: 'Time Management',
    subjects: ['time management', 'productivity', 'self-management'],
  },
};

const pickDescription = (work) => {
  if (typeof work.description === 'string') return work.description;
  if (work.description?.value) return work.description.value;
  return 'A standout read drawing attention from curious readers right now.';
};

const normalizeBook = (work, category) => ({
  category,
  title: work.title,
  author: work.authors?.[0]?.name || 'Unknown author',
  coverUrl: work.cover_id
    ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
    : 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  description: pickDescription(work),
  rating: Math.max(3.8, Math.min(5, ((work.ratings_average || 4.2) + (work.want_to_read_count ? 0.2 : 0)).toFixed(1))),
  year: work.first_publish_year || null,
  sourceKey: `${category}:${work.key}`,
});

async function fetchCategoryBooks(category) {
  const config = categoryConfigs[category];
  if (!config) {
    throw new Error('Unknown category');
  }

  const subjectResults = await Promise.all(
    config.subjects.map((subject) =>
      axios.get(`https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json`, {
        params: { limit: 12, details: 'true' },
        timeout: 10000,
      })
    )
  );

  const deduped = new Map();
  for (const response of subjectResults) {
    for (const work of response.data.works || []) {
      if (!work?.key || deduped.has(work.key)) continue;
      deduped.set(work.key, normalizeBook(work, category));
    }
  }

  const books = [...deduped.values()]
    .sort((a, b) => b.rating - a.rating || (b.year || 0) - (a.year || 0))
    .slice(0, 8);

  await Promise.all(
    books.map((book) =>
      prisma.book.upsert({
        where: { sourceKey: book.sourceKey },
        update: book,
        create: book,
      })
    )
  );

  return books;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', date: new Date().toISOString() });
});

app.get('/api/books', async (req, res) => {
  try {
    const categories = Object.keys(categoryConfigs);
    const results = await Promise.all(categories.map((category) => fetchCategoryBooks(category)));
    const payload = categories.reduce((acc, category, index) => {
      acc[category] = {
        title: categoryConfigs[category].title,
        books: results[index],
      };
      return acc;
    }, {});

    res.json({ updatedAt: new Date().toISOString(), categories: payload });
  } catch (error) {
    console.error('Failed to fetch books', error.message);
    const cached = await prisma.book.findMany({ orderBy: { rating: 'desc' } });
    if (cached.length) {
      const payload = cached.reduce((acc, book) => {
        if (!acc[book.category]) {
          acc[book.category] = { title: categoryConfigs[book.category]?.title || book.category, books: [] };
        }
        acc[book.category].books.push(book);
        return acc;
      }, {});
      return res.json({ updatedAt: new Date().toISOString(), categories: payload, cached: true });
    }
    res.status(500).json({ error: 'Unable to load books right now.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port 3001');
});
