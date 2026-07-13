import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'

import useStores from '../../hooks-use-stores'
import { Loan } from '../../view-models/loan'
import BorrowForm from './borrow-return-form'

const isOverdue = (loan: Loan) => (
  loan.status === 'borrowed' && new Date(loan.due_date) < new Date(new Date().toDateString())
)

const LoanList = () => {
  const { loansStore, booksStore, membersStore } = useStores()
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    loansStore.fetchLoans()
    booksStore.fetchBooks()
    membersStore.fetchMembers()
  }, [loansStore, booksStore, membersStore])

  const handleReturn = (loan: Loan) => {
    loansStore.returnLoan(loan.id)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Loans</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Borrow a Book
        </Button>
      </Box>

      {loansStore.loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Borrowed</TableCell>
              <TableCell>Due</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loansStore.loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.book_title}</TableCell>
                <TableCell>{loan.member_name}</TableCell>
                <TableCell>{loan.borrowed_at.slice(0, 10)}</TableCell>
                <TableCell>{loan.due_date}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={isOverdue(loan) ? 'overdue' : loan.status}
                    color={
                      loan.status === 'returned'
                        ? 'default'
                        : (isOverdue(loan) ? 'error' : 'success')
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {loan.status === 'borrowed' && (
                    <Button size="small" onClick={() => handleReturn(loan)}>
                      Return
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {loansStore.loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No loans yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <BorrowForm open={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  )
}

export default observer(LoanList)
