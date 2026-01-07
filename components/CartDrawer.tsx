"use client"

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { removeFromCart, updateQuantity, clearCart } from "@/store/slices/cartSlice"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    } else {
      dispatch(removeFromCart(id))
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Shopping Cart ({cartItems.length})
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {cartItems.length === 0 ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Add some products to get started!
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
              {cartItems.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    mb: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                  }}
                  alignItems="flex-start"
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={item.image}
                      alt={item.title}
                      sx={{ width: 80, height: 80, bgcolor: "white", p: 1 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ ml: 2 }}
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            sx={{ border: 1, borderColor: "divider" }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ minWidth: 30, textAlign: "center", fontWeight: 600 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            sx={{ border: 1, borderColor: "divider" }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => dispatch(removeFromCart(item.id))}
                            color="error"
                            sx={{ ml: "auto" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
              <Button variant="contained" fullWidth size="large" sx={{ mb: 1, fontWeight: 600 }}>
                Checkout
              </Button>
              <Button variant="outlined" fullWidth onClick={() => dispatch(clearCart())} sx={{ fontWeight: 600 }}>
                Clear Cart
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  )
}
