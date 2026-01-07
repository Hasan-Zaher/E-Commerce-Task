"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ fontWeight: 600 }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
