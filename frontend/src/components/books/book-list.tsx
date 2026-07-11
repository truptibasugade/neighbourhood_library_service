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
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

import useStores from '../../hooks-use-stores'
import { Book, IBookInput } from '../../view-models/book'
import BookForm from './book-form'

const BookList = () => {
  const { booksStore } = useStores()
  const [formOpen, setFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  useEffect(() => {
    booksStore.fetchBooks()
  }, [booksStore])

  const openAddForm = () => {
    setEditingBook(null)
    setFormOpen(true)
  }

  const openEditForm = (book: Book) => {
    setEditingBook(book)
    setFormOpen(true)
  }

  const handleSubmit = (data: IBookInput) => (
    editingBook
      ? booksStore.updateBook(editingBook.id, data)
      : booksStore.createBook(data)
  )

  const handleDelete = (book: Book) => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      booksStore.deleteBook(book.id)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Books</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddForm}>
          Add Book
        </Button>
      </Box>

      {booksStore.loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell align="center">Availability</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {booksStore.books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={`${book.available_copies} / ${book.total_copies}`}
                    color={book.available_copies > 0 ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEditForm(book)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(book)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {booksStore.books.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No books yet. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <BookForm
        open={formOpen}
        book={editingBook}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default observer(BookList)
