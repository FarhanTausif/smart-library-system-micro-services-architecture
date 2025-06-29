import Book from '../models/Book.js';

export async function createBookService({ title, author, isbn, copies }) {
  const now = new Date();
  const book = new Book({
    title,
    author,
    isbn,
    copies,
    available_copies: copies,
    created_at: now
  });
  await book.save();
  return book;
}

export async function searchBooksService(search, page = 1, per_page = 10) {
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { isbn: { $regex: search, $options: 'i' } }
        ]
      }
    : {};
  const skip = (page - 1) * per_page;
  const books = await Book.find(query).skip(skip).limit(Number(per_page));
  const total = await Book.countDocuments(query);
  return { books, total };
}

export async function getBookByIdService(id) {
  return Book.findById(id);
}

export async function updateBookService(id, { copies }) {
  const book = await Book.findById(id);
  if (!book) return null;
  if (copies !== undefined) {
    // Adjust available_copies if total copies is reduced
    if (copies < book.available_copies) {
      book.available_copies = copies;
    }
    book.copies = copies;
  }
  // Ensure available_copies never exceeds copies
  if (book.available_copies > book.copies) {
    book.available_copies = book.copies;
  }
  book.updated_at = new Date();
  await book.save();
  return book;
}

export async function updateBookAvailabilityService(id, { available_copies, operation }) {
  const book = await Book.findById(id);
  if (!book) return null;
  if (operation === 'increment') {
    book.available_copies = (book.available_copies || 0) + 1;
  } else if (operation === 'decrement') {
    book.available_copies = Math.max(0, (book.available_copies || 0) - 1);
  } else if (available_copies !== undefined) {
    book.available_copies = available_copies;
  }
  // Ensure available_copies never exceeds copies
  if (book.available_copies > book.copies) {
    book.available_copies = book.copies;
  }
  book.updated_at = new Date();
  await book.save();
  return book;
}

export async function deleteBookService(id) {
  const result = await Book.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

export async function getAllBooksService() {
  try {
    const books = await Book.find();
    return books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      copies: book.copies,
      available_copies: book.available_copies,
      created_at: book.created_at
    }));
  } catch (error) {
    throw new Error('Failed to fetch books');
  }
}
