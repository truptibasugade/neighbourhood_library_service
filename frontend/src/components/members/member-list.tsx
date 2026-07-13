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
import { Member, IMemberInput } from '../../view-models/member'
import MemberForm from './member-form'

const MemberList = () => {
  const { membersStore } = useStores()
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  useEffect(() => {
    membersStore.fetchMembers()
  }, [membersStore])

  const openAddForm = () => {
    setEditingMember(null)
    setFormOpen(true)
  }

  const openEditForm = (member: Member) => {
    setEditingMember(member)
    setFormOpen(true)
  }

  const handleSubmit = (data: IMemberInput) => (
    editingMember
      ? membersStore.updateMember(editingMember.id, data)
      : membersStore.createMember(data)
  )

  const handleDelete = (member: Member) => {
    if (window.confirm(`Delete "${member.first_name} ${member.last_name}"?`)) {
      membersStore.deleteMember(member.id)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Members</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddForm}>
          Add Member
        </Button>
      </Box>

      {membersStore.loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Member Since</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membersStore.members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{`${member.first_name} ${member.last_name}`}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.membership_date}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={member.status}
                    color={member.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEditForm(member)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(member)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {membersStore.members.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No members yet. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <MemberForm
        open={formOpen}
        member={editingMember}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default observer(MemberList)
