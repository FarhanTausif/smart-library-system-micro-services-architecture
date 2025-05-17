import Loan from '../models/Loan.js';
import { 
    userServiceBreaker, 
    bookServiceBreaker, 
    bookAvailabilityBreaker } 
from './externalServices.js';

export async function createLoan({ user_id, book_id, due_date }) {
  try {
    // Validate user existence
    const user = await userServiceBreaker.fire(user_id);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // Validate book existence and availability
    const book = await bookServiceBreaker.fire(book_id);
    if (!book) {
      throw { status: 404, message: 'Book not found' };
    }
    if (book.available_copies <= 0) {
      throw { status: 400, message: 'No available copies of the book' };
    }

    // Create the loan record
    const loan = new Loan({
      user_id,
      book_id,
      due_date,
      status: 'ACTIVE'
    });
    await loan.save();

    // Update book availability via Book-Service
    await bookAvailabilityBreaker.fire(book_id, 'decrement');

    return loan;
  } catch (error) {
    if (error.name === 'BreakerOpenError') {
      throw { status: 503, message: 'Service temporarily unavailable' };
    }
    throw error;
  }
}

export async function returnLoan({ loan_id }) {
  try {
    // Find the loan record
    const loan = await Loan.findById(loan_id);
    if (!loan) {
      throw { status: 404, message: 'Loan not found' };
    }
    if (loan.status === 'RETURNED') {
      throw { status: 400, message: 'Loan is already returned' };
    }

    // Update loan status to RETURNED and set return_date
    loan.status = 'RETURNED';
    loan.return_date = new Date();
    await loan.save();

    // Increment book availability via Book-Service
    await bookAvailabilityBreaker.fire(loan.book_id, 'increment');

    return loan;
  } catch (error) {
    if (error.name === 'BreakerOpenError') {
      throw { status: 503, message: 'Service temporarily unavailable' };
    }
    throw error;
  }
}

export async function getUserLoanHistory(user_id) {
  try {
    // Validate user existence
    await userServiceBreaker.fire(user_id);

    // Fetch loans for the given user_id
    const loans = await Loan.find({ user_id });

    // Fetch book details for each loan
    const loanDetails = await Promise.all(loans.map(async (loan) => {
      const book = await bookServiceBreaker.fire(loan.book_id);
      return {
        id: loan._id,
        book: {
          id: loan.book_id,
          title: book?.title,
          author: book?.author
        },
        issue_date: loan.issue_date,
        due_date: loan.due_date,
        return_date: loan.return_date || null,
        status: loan.status
      };
    }));

    return {
      loans: loanDetails,
      total: loanDetails.length
    };
  } catch (error) {
    if (error.name === 'BreakerOpenError') {
      throw { status: 503, message: 'User-Service temporarily unavailable' };
    }
    throw error;
  }
}

export async function getLoanDetails(loan_id) {
  try {
    // Fetch the loan by ID
    const loan = await Loan.findById(loan_id);
    if (!loan) {
      throw { status: 404, message: 'Loan not found' };
    }

    // Fetch user and book details
    const [user, book] = await Promise.all([
      userServiceBreaker.fire(loan.user_id),
      bookServiceBreaker.fire(loan.book_id)
    ]);

    return {
      id: loan._id,
      user: {
        id: loan.user_id,
        name: user?.name,
        email: user?.email
      },
      book: {
        id: loan.book_id,
        title: book?.title,
        author: book?.author
      },
      issue_date: loan.issue_date,
      due_date: loan.due_date,
      return_date: loan.return_date || null,
      status: loan.status
    };
  } catch (error) {
    if (error.name === 'BreakerOpenError') {
      throw { status: 503, message: 'External service temporarily unavailable' };
    }
    throw error;
  }
}

export async function getOverdueLoans() {
  const today = new Date();

  // Fetch overdue loans
  const loans = await Loan.find({
    due_date: { $lt: today },
    status: 'ACTIVE'
  });

  // Fetch user and book details for each loan
  const overdueLoanDetails = await Promise.all(loans.map(async (loan) => {
    const [user, book] = await Promise.all([
      userServiceBreaker.fire(loan.user_id),
      bookServiceBreaker.fire(loan.book_id)
    ]);
    return {
      id: loan._id,
      user: {
        id: loan.user_id,
        name: user?.name,
        email: user?.email
      },
      book: {
        id: loan.book_id,
        title: book?.title,
        author: book?.author
      },
      issue_date: loan.issue_date,
      due_date: loan.due_date,
      days_overdue: Math.ceil((today - loan.due_date) / (1000 * 60 * 60 * 24))
    };
  }));

  return overdueLoanDetails;
}

export async function extendLoanDueDate(loan_id, extension_days) {
  try {
    // Find the loan record
    const loan = await Loan.findById(loan_id);
    if (!loan) {
      throw { status: 404, message: 'Loan not found' };
    }
    if (loan.status !== 'ACTIVE') {
      throw { status: 400, message: 'Cannot extend due date for a non-active loan' };
    }

    // Validate that book and user still exist
    await Promise.all([
      userServiceBreaker.fire(loan.user_id),
      bookServiceBreaker.fire(loan.book_id)
    ]);

    // Extend the due date
    loan.due_date = new Date(loan.due_date.getTime() + extension_days * 24 * 60 * 60 * 1000);
    loan.extensions_count = (loan.extensions_count || 0) + 1;
    await loan.save();

    return {
      id: loan._id,
      user_id: loan.user_id,
      book_id: loan.book_id,
      issue_date: loan.issue_date,
      original_due_date: loan.due_date,
      extended_due_date: loan.due_date,
      status: loan.status,
      extensions_count: loan.extensions_count
    };
  } catch (error) {
    if (error.name === 'BreakerOpenError') {
      throw { status: 503, message: 'External service temporarily unavailable' };
    }
    throw error;
  }
}
