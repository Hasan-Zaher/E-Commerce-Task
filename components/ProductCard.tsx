
"use client"

import type React from "react"
import { Card, CardMedia, CardContent, Typography, Box, Button, Rating, Chip } from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import VisibilityIcon from "@mui/icons-material/Visibility"
import type { Product } from "@/store/services/productsApi"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/slices/cartSlice"

interface ProductCardProps {
  product: Product
  onViewDetails: () => void
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(addToCart(product))
  }

  return (
    <Card
      sx={{
        height: '460px', 
        display: 'grid',
        width: "300px",
        gridTemplateRows: '220px 1fr',  
        gridTemplateColumns: '1fr',
        transition: 'transform 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        }
      }}
    >
 
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          p: 2,
        }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.title}
          sx={{
            width: 'auto',
            height: '100%',
            maxWidth: '100c',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
        <Chip
          label={product.category}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: "capitalize",
          }}
        />
      </Box>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          height: '100%',
          '&:last-child': { pb: 2 }
        }}
      >
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            height: '3.6em',
            mb: 1.5,
          }}
        >
          {product.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, height: '28px' }}>
          {product.rating && (
            <>
              <Rating value={product.rating.rate} precision={0.1} size="small" readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product.rating.count})
              </Typography>
            </>
          )}
        </Box>

        <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2, height: '40px' }}>
          ${product.price.toFixed(2)}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: 'auto', height: '40px' }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            fullWidth
            size="small"
            sx={{ fontWeight: 600 }}
          >
            Add to Cart
          </Button>
          <Button
            variant="outlined"
            onClick={onViewDetails}
            size="small"
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <VisibilityIcon />
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
