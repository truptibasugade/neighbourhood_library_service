import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import Home from '../components/home/home'
import BookList from '../components/books/book-list'
import MemberList from '../components/members/member-list'
import LoanList from '../components/loans/loan-list'

const LibraryRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/books" element={<BookList />} />
    <Route path="/members" element={<MemberList />} />
    <Route path="/loans" element={<LoanList />} />
  </Routes>
)

export default observer(LibraryRoutes)
