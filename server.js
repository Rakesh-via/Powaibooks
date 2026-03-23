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
    subjects: ['physics', 'quantum_physics', 'astrophysics'],
    curatedWorks: [
      { title: 'A Brief History of Time', author: 'Stephen Hawking' },
      { title: 'The Elegant Universe', author: 'Brian Greene' },
      { title: 'Six Easy Pieces', author: 'Richard P. Feynman' },
      { title: 'The Fabric of the Cosmos', author: 'Brian Greene' },
      { title: 'Seven Brief Lessons on Physics', author: 'Carlo Rovelli' },
      { title: 'The Order of Time', author: 'Carlo Rovelli' },
    ],
    preferredTitles: [
      'A Brief History of Time',
      'The Elegant Universe',
      'Six Easy Pieces',
      'The Fabric of the Cosmos',
      'Seven Brief Lessons on Physics',
      'The Order of Time',
    ],
  },
  'ancient-india-history': {
    title: 'History of India',
    subjects: ['history_of_india', 'india_history', 'south_asia_history'],
    curatedWorks: [
      { title: 'The Golden Road', author: 'William Dalrymple' },
      { title: 'The Anarchy', author: 'William Dalrymple' },
      { title: 'The Wonder That Was India', author: 'A. L. Basham' },
      { title: 'India: A History', author: 'John Keay' },
      { title: 'Early India', author: 'Romila Thapar' },
      { title: 'The Penguin History of Early India', author: 'Romila Thapar' },
    ],
    preferredTitles: [
      'The Golden Road',
      'The Anarchy',
      'The Wonder That Was India',
      'India: A History',
      'Early India',
      'The Penguin History of Early India',
    ],
  },
  'time-management': {
    title: 'Time Management',
    subjects: ['time_management', 'productivity', 'self_management'],
    curatedWorks: [
      { title: 'Deep Work', author: 'Cal Newport' },
      { title: 'Getting Things Done', author: 'David Allen' },
      { title: 'Essentialism', author: 'Greg McKeown' },
      { title: 'Four Thousand Weeks', author: 'Oliver Burkeman' },
      { title: 'Make Time', author: 'Jake Knapp' },
      { title: '168 Hours', author: 'Laura Vanderkam' },
      { title: 'Atomic Habits', author: 'James Clear' },
      { title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey' },
    ],
    preferredTitles: [
      'Deep Work',
      'Getting Things Done',
      'Essentialism',
      'Four Thousand Weeks',
      'Make Time',
      '168 Hours',
      'Atomic Habits',
      'The 7 Habits of Highly Effective People',
    ],
  },
};

const titleAliases = {
  'Golden Road': 'The Golden Road',
  'India': 'India: A History',
  'Make time': 'Make Time',
  'The wonder that was India': 'The Wonder That Was India',
};


const goodreadsLinks = {
  'A Brief History of Time|Stephen Hawking': 'https://www.goodreads.com/book/show/3869.A_Brief_History_of_Time',
  'The Elegant Universe|Brian Greene': 'https://www.goodreads.com/book/show/8049273-the-elegant-universe',
  'Six Easy Pieces|Richard P. Feynman': 'https://www.goodreads.com/book/show/5553.Six_Easy_Pieces',
  'The Fabric of the Cosmos|Brian Greene': 'https://www.goodreads.com/book/show/22435.The_Fabric_of_the_Cosmos',
  'Seven Brief Lessons on Physics|Carlo Rovelli': 'https://www.goodreads.com/book/show/25734172-seven-brief-lessons-on-physics',
  'The Order of Time|Carlo Rovelli': 'https://www.goodreads.com/book/show/36442813-the-order-of-time',
  'The Golden Road|William Dalrymple': 'https://www.goodreads.com/book/show/201608148-the-golden-road',
  'The Anarchy|William Dalrymple': 'https://www.goodreads.com/book/show/42972023-the-anarchy',
  'The Wonder That Was India|A. L. Basham': 'https://www.goodreads.com/book/show/631246.The_Wonder_That_Was_India',
  'India: A History|John Keay': 'https://www.goodreads.com/book/show/134694389-india',
  'Early India|Romila Thapar': 'https://www.goodreads.com/book/show/276117.Early_India',
  'The Penguin History of Early India|Romila Thapar': 'https://www.goodreads.com/book/show/60799304-the-penguin-history-of-early-india',
  'Deep Work|Cal Newport': 'https://www.goodreads.com/book/show/25744928-deep-work',
  'Getting Things Done|David Allen': 'https://www.goodreads.com/book/show/1633.Getting_Things_Done',
  'Essentialism|Greg McKeown': 'https://www.goodreads.com/book/show/19776547-essentialism',
  'Four Thousand Weeks|Oliver Burkeman': 'https://www.goodreads.com/book/show/54785515-four-thousand-weeks',
  'Make Time|Jake Knapp': 'https://www.goodreads.com/book/show/37880811-make-time',
  '168 Hours|Laura Vanderkam': 'https://www.goodreads.com/book/show/7847359-168-hours',
  'Atomic Habits|James Clear': 'https://www.goodreads.com/book/show/40121378-atomic-habits',
  'The 7 Habits of Highly Effective People|Stephen R. Covey': 'https://www.goodreads.com/book/show/36072.The_7_Habits_of_Highly_Effective_People',
};

const getCanonicalTitle = (title) => titleAliases[title] || title;

const getGoodreadsLink = (title, author) => {
  const canonicalTitle = getCanonicalTitle(title);
  return goodreadsLinks[`${canonicalTitle}|${author}`] || goodreadsLinks[`${title}|${author}`] || buildBookLink(canonicalTitle, author);
};

const pickDescription = (work, category) => {
  if (typeof work.description === 'string') return work.description;
  if (work.description?.value) return work.description.value;
  if (category === 'time-management') return 'A practical, high-interest pick for professionals trying to focus, prioritize, and use their time better.';
  if (category === 'ancient-india-history') return 'A widely discussed history title drawing strong reader interest.';
  return 'A standout read drawing attention from curious readers right now.';
};

const buildBookLink = (title, author) => {
  const query = encodeURIComponent(`${title} ${author}`.trim());
  return `https://www.goodreads.com/search?q=${query}`;
};

const normalizeBook = (work, category) => ({
  category,
  title: work.title,
  author: work.authors?.[0]?.name || 'Unknown author',
  coverUrl: work.cover_id
    ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
    : 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  description: pickDescription(work, category),
  rating: Math.max(3.8, Math.min(5, ((work.ratings_average || 4.2) + (work.want_to_read_count ? 0.2 : 0)).toFixed(1))),
  year: work.first_publish_year || null,
  sourceKey: `${category}:${work.key}`,
  externalUrl: getGoodreadsLink(work.title, work.authors?.[0]?.name || 'Unknown author'),
  externalSource: 'Goodreads',
});

async function searchWorks(query) {
  const response = await axios.get('https://openlibrary.org/search.json', {
    params: { q: query, limit: 10 },
    timeout: 10000,
  });
  return response.data.docs || [];
}

async function searchWorksSafe(query) {
  try {
    return await searchWorks(query);
  } catch (error) {
    console.error(`Search failed for query: ${query}`, error.message);
    return [];
  }
}

function normalizeSearchDoc(doc, category) {
  return {
    category,
    title: doc.title,
    author: doc.author_name?.[0] || 'Unknown author',
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: doc.first_sentence?.[0] || (category === 'time-management'
      ? 'A practical, high-interest pick for professionals trying to focus, prioritize, and use their time better.'
      : 'A widely discussed history title drawing strong reader interest.'),
    rating: Math.max(3.9, Math.min(5, Number((((doc.ratings_average || 4.2) + ((doc.ratings_count || 0) > 20 ? 0.2 : 0))).toFixed(1)))),
    year: doc.first_publish_year || null,
    sourceKey: `${category}:search:${doc.key}`,
    externalUrl: getGoodreadsLink(doc.title, doc.author_name?.[0] || 'Unknown author'),
    externalSource: 'Goodreads',
  };
}

async function fetchCategoryBooks(category) {
  const config = categoryConfigs[category];
  if (!config) {
    throw new Error('Unknown category');
  }

  const deduped = new Map();

  const subjectResults = await Promise.all(
    config.subjects.map((subject) =>
      axios.get(`https://openlibrary.org/subjects/${subject}.json`, {
        params: { limit: 12, details: 'true' },
        timeout: 10000,
      }).catch(() => ({ data: { works: [] } }))
    )
  );

  for (const response of subjectResults) {
    for (const work of response.data.works || []) {
      if (!work?.key || deduped.has(work.key)) continue;
      deduped.set(work.key, normalizeBook(work, category));
    }
  }

  if (config.curatedWorks?.length) {
    const curatedResults = await Promise.all(
      config.curatedWorks.map(async (item) => {
        const docs = await searchWorksSafe(`${item.title} ${item.author}`);
        return docs.find((doc) => {
          const title = (doc.title || '').toLowerCase();
          const author = (doc.author_name?.[0] || '').toLowerCase();
          return title.includes(item.title.toLowerCase()) && author.includes(item.author.toLowerCase().split(' ')[0]);
        }) || docs[0] || null;
      })
    );

    for (const doc of curatedResults) {
      if (!doc?.key || deduped.has(`search:${doc.key}`)) continue;
      deduped.set(`search:${doc.key}`, normalizeSearchDoc(doc, category));
    }
  }

  let books = [...deduped.values()];

  if (category === 'time-management') {
    const bannedPhrases = ['catalan integral cooperative'];
    books = books.filter((book) => !bannedPhrases.some((phrase) => book.title.toLowerCase().includes(phrase)));
  }

  if (config.preferredTitles?.length) {
    const preferredBooks = config.preferredTitles
      .map((preferredTitle) => books.find((book) => getCanonicalTitle(book.title) === preferredTitle))
      .filter(Boolean);
    const seen = new Set(preferredBooks.map((book) => book.sourceKey));
    const remainingBooks = books
      .filter((book) => !seen.has(book.sourceKey))
      .sort((a, b) => b.rating - a.rating || (b.year || 0) - (a.year || 0));
    books = [...preferredBooks, ...remainingBooks].slice(0, 8);
  } else {
    books = books
      .sort((a, b) => b.rating - a.rating || (b.year || 0) - (a.year || 0))
      .slice(0, 8);
  }

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
    const validCategories = Object.keys(categoryConfigs);
    const cached = await prisma.book.findMany({
      where: { category: { in: validCategories } },
      orderBy: [{ category: 'asc' }, { rating: 'desc' }],
    });
    if (cached.length) {
      const payload = validCategories.reduce((acc, category) => {
        acc[category] = { title: categoryConfigs[category].title, books: [] };
        return acc;
      }, {});
      for (const book of cached) {
        payload[book.category].books.push(book);
      }
      return res.json({ updatedAt: new Date().toISOString(), categories: payload, cached: true, warning: 'Showing cached books while live refresh is unavailable.' });
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
