import express from 'express';
import { 
    createBookService, 
    searchBooksService, 
    getBookByIdService, 
    updateBookService, 
    updateBookAvailabilityService, 
    deleteBookService,
    getAllBooksService
} from '../services/bookService.js';

const router = express.Router();

// Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, copies } = req.body;
    if (!title || !author || !isbn || !copies) {
      return res.status(400).json({ error: 'title, author, isbn, and copies are required' });
    }
    const book = await createBookService({ title, author, isbn, copies });
    res.status(201).json({
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies,
      available_copies: book.available_copies,
      created_at: book.created_at.toISOString()
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'ISBN already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search for books by title, author, or keyword
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, per_page = 10 } = req.query;
    const { books, total } = await searchBooksService(search, page, per_page);
    res.json({
      books: books.map(book => ({
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        copies: book.copies,
        available_copies: book.available_copies
      })),
      total,
      page: Number(page),
      per_page: Number(per_page)
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve detailed information about a specific book
router.get('/:id', async (req, res) => {
  try {
    const book = await getBookByIdService(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies,
      available_copies: book.available_copies,
      created_at: book.created_at.toISOString(),
      updated_at: book.updated_at ? book.updated_at.toISOString() : undefined
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update book information
router.put('/:id', async (req, res) => {
  try {
    const { copies } = req.body;
    const book = await updateBookService(req.params.id, { copies });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies,
      available_copies: book.available_copies,
      created_at: book.created_at.toISOString(),
      updated_at: book.updated_at ? book.updated_at.toISOString() : undefined
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a book's available copies
router.patch('/:id/availability', async (req, res) => {
  try {
    const { available_copies, operation } = req.body;
    const book = await updateBookAvailabilityService(req.params.id, { available_copies, operation });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({
      id: book._id,
      available_copies: book.available_copies,
      updated_at: book.updated_at ? book.updated_at.toISOString() : undefined
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a book from the catalog
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteBookService(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/books - Get all books
router.get('/api/books', async (req, res) => {
  try {
    const books = await getAllBooksService();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
