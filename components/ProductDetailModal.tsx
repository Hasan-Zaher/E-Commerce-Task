"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Rating,
  Button,
  Chip,
  Grid,
  Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import type { Product } from "@/store/services/productsApi"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/slices/cartSlice"

interface ProductDetailModalProps {
  product: Product
  open: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const dispatch = useAppDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
          Product Details
        </Typography>
        <IconButton onClick={onClose} sx={{ ml: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "100%",
                bgcolor: "white",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.title}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  p: 3,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Chip
                label={product.category}
                size="small"
                sx={{
                  alignSelf: "flex-start",
                  mb: 2,
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              />

              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {product.title}
              </Typography>

              {product.rating && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Rating value={product.rating.rate} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                ${product.price.toFixed(2)}
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                {product.description}
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{ mt: "auto", fontWeight: 600, py: 1.5 }}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
