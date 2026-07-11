import React from 'react'

import NotifierStore from './store/notifier-store'
import ApiRequest from './store/api-request'
import BooksStore from './store/books-store'
import MembersStore from './store/members-store'
import LoansStore from './store/loans-store'

const notifierStore = new NotifierStore()
const apiRequest = new ApiRequest()

const booksStore = new BooksStore(apiRequest, notifierStore)
const membersStore = new MembersStore(apiRequest, notifierStore)
const loansStore = new LoansStore(apiRequest, notifierStore)

const stores = {
  notifierStore,
  booksStore,
  membersStore,
  loansStore,
}

const storesContext = React.createContext(stores)

export default storesContext
