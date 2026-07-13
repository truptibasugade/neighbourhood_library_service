import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import useStores from '../../hooks-use-stores'

interface BorrowFormProps {
  open: boolean
  onClose: () => void
}

const BorrowForm: React.FC<BorrowFormProps> = ({ open, onClose }) => {
  const { booksStore, membersStore, loansStore } = useStores()
  const [bookId, setBookId] = useState<string>('')
  const [memberId, setMemberId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  const availableBooks = booksStore.books.filter((book) => book.available_copies > 0)
  const activeMembers = membersStore.members.filter((member) => member.status === 'active')

  const handleClose = () => {
    setBookId('')
    setMemberId('')
    onClose()
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const success = await loansStore.borrowBook(Number(bookId), Number(memberId))
    setSubmitting(false)
    if (success) handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Borrow a Book</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            label="Book"
            value={bookId}
            onChange={(event) => setBookId(event.target.value)}
            required
            fullWidth
            helperText={availableBooks.length === 0 ? 'No books currently available.' : ''}
          >
            {availableBooks.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {`${book.title} (${book.available_copies} available)`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Member"
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
            required
            fullWidth
            helperText={activeMembers.length === 0 ? 'No active members.' : ''}
          >
            {activeMembers.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {`${member.first_name} ${member.last_name}`}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !bookId || !memberId}
        >
          Borrow
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default observer(BorrowForm)
