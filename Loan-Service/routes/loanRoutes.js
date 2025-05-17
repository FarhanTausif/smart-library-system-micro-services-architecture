import express from 'express';
import { 
    createLoan, 
    returnLoan, 
    getUserLoanHistory,
    getLoanDetails,
    getOverdueLoans,
    extendLoanDueDate } 
from '../services/loanService.js';

const router = express.Router();

// POST /api/loans - Create a new loan
router.post('/loans', async (req, res) => {
  try {
    const loan = await createLoan(req.body);
    res.status(201).json(loan);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// POST /api/returns - Return a borrowed book
router.post('/returns', async (req, res) => {
  try {
    const loan = await returnLoan(req.body);
    res.status(200).json(loan);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// GET /api/loans/user/:user_id - Get a user's loan history
router.get('/loans/user/:user_id', async (req, res) => {
  try {
    const loanHistory = await getUserLoanHistory(req.params.user_id);
    res.status(200).json(loanHistory);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// GET /api/loans/overdue - List all overdue loans
router.get('/loans/overdue', async (req, res) => {
  try {
    const overdueLoans = await getOverdueLoans();
    res.status(200).json(overdueLoans);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// GET /api/loans/:id - Get details of a specific loan
router.get('/loans/:id', async (req, res) => {
  try {
    const loanDetails = await getLoanDetails(req.params.id);
    res.status(200).json(loanDetails);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

// PUT /api/loans/:id/extend - Extend the due date for a loan
router.put('/loans/:id/extend', async (req, res) => {
  try {
    const { extension_days, extensions_count, status } = req.body;
    const extendedLoan = await extendLoanDueDate(req.params.id, extension_days);
     // Check if the loan exists or is already returned
    if (status === 'RETURNED') {
      return res.status(400).json({ error: 'Invalid loan or already returned' });
    }

    // Check if the maximum number of extensions has been reached
    if (extensions_count >= 3) {
      return res.status(400).json({ error: 'Maximum extensions reached' });
    }
    res.status(200).json(extendedLoan);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

export default router;
