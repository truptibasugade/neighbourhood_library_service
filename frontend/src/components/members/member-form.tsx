import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

import { Member, IMemberInput } from '../../view-models/member'

interface MemberFormProps {
  open: boolean
  member: Member | null
  onClose: () => void
  onSubmit: (data: IMemberInput) => Promise<boolean>
}

const emptyForm: IMemberInput = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  status: 'active',
}

const MemberForm: React.FC<MemberFormProps> = ({
  open, member, onClose, onSubmit,
}) => {
  const [form, setForm] = useState<IMemberInput>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (member) {
      setForm({
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        phone: member.phone,
        address: member.address,
        status: member.status,
      })
    } else {
      setForm(emptyForm)
    }
  }, [member, open])

  const handleChange = (field: keyof IMemberInput) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target
    setForm((prev) => ({ ...prev, [field]: value } as IMemberInput))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const success = await onSubmit(form)
    setSubmitting(false)
    if (success) onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{member ? 'Edit Member' : 'Add Member'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="First Name"
            value={form.first_name}
            onChange={handleChange('first_name')}
            required
            fullWidth
          />
          <TextField
            label="Last Name"
            value={form.last_name}
            onChange={handleChange('last_name')}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
            fullWidth
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={handleChange('phone')}
            fullWidth
          />
          <TextField
            label="Address"
            value={form.address}
            onChange={handleChange('address')}
            fullWidth
          />
          {member && (
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={handleChange('status')}
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !form.first_name || !form.last_name || !form.email}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MemberForm
