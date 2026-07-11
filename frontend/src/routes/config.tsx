import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'

export enum MENU_PAGES {
  HOME = 'Home',
  BOOKS = 'Books',
  MEMBERS = 'Members',
  LOANS = 'Loans',
}

export const menuItems = [
  {
    path: '/',
    menuIcon: <HomeRoundedIcon />,
    menuText: MENU_PAGES.HOME,
  },
  {
    path: '/books',
    menuIcon: <MenuBookRoundedIcon />,
    menuText: MENU_PAGES.BOOKS,
  },
  {
    path: '/members',
    menuIcon: <PeopleRoundedIcon />,
    menuText: MENU_PAGES.MEMBERS,
  },
  {
    path: '/loans',
    menuIcon: <SwapHorizRoundedIcon />,
    menuText: MENU_PAGES.LOANS,
  },
]
