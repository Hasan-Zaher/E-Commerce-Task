"use client"

import type React from "react"

import { Card, CardMedia, CardContent, Typography, Box, Button, Rating, Chip } from "@mui/material"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import VisibilityIcon from "@mui/icons-material/Visibility"
import type { Product } from "@/store/services/productsApi"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/slices/cartSlice"
import styled from "@emotion/styled"

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
  }
`

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
    <StyledCard>
      <Box sx={{ position: "relative", pt: "100%", overflow: "hidden", bgcolor: "white" }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.title}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            p: 2,
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
            textTransform: "capitalize",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "3.6em",
          }}
        >
          {product.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          {product.rating && (
            <>
              <Rating value={product.rating.rate} precision={0.1} size="small" readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product.rating.count})
              </Typography>
            </>
          )}
        </Box>

        <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
          ${product.price.toFixed(2)}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            fullWidth
            sx={{ fontWeight: 600 }}
          >
            Add to Cart
          </Button>
          <Button variant="outlined" onClick={onViewDetails} sx={{ minWidth: "auto", px: 2 }}>
            <VisibilityIcon />
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  )
}
