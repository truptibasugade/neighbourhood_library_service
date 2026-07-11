import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { Book, IBookInput } from '../../view-models/book'

interface BookFormProps {
  open: boolean
  book: Book | null
  onClose: () => void
  onSubmit: (data: IBookInput) => Promise<boolean>
}

const emptyForm: IBookInput = {
  isbn: '',
  title: '',
  author: '',
  genre: '',
  publisher: '',
  published_year: null,
  total_copies: 1,
}

const BookForm: React.FC<BookFormProps> = ({
  open, book, onClose, onSubmit,
}) => {
  const [form, setForm] = useState<IBookInput>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (book) {
      setForm({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        genre: book.genre,
        publisher: book.publisher,
        published_year: book.published_year,
        total_copies: book.total_copies,
      })
    } else {
      setForm(emptyForm)
    }
  }, [book, open])

  const handleChange = (field: keyof IBookInput) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target
    setForm((prev) => ({
      ...prev,
      [field]: field === 'total_copies' || field === 'published_year'
        ? (value === '' ? null : Number(value))
        : value,
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const success = await onSubmit(form)
    setSubmitting(false)
    if (success) onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{book ? 'Edit Book' : 'Add Book'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            required
            fullWidth
          />
          <TextField
            label="Author"
            value={form.author}
            onChange={handleChange('author')}
            required
            fullWidth
          />
          <TextField
            label="ISBN"
            value={form.isbn}
            onChange={handleChange('isbn')}
            required
            fullWidth
          />
          <TextField
            label="Genre"
            value={form.genre}
            onChange={handleChange('genre')}
            fullWidth
          />
          <TextField
            label="Publisher"
            value={form.publisher}
            onChange={handleChange('publisher')}
            fullWidth
          />
          <TextField
            label="Published Year"
            type="number"
            value={form.published_year ?? ''}
            onChange={handleChange('published_year')}
            fullWidth
          />
          <TextField
            label="Total Copies"
            type="number"
            value={form.total_copies}
            onChange={handleChange('total_copies')}
            required
            fullWidth
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !form.title || !form.author || !form.isbn}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BookForm
