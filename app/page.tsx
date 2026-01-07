"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Rating,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Badge,
  AppBar,
  Toolbar,
  Drawer,
  Button,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import FilterListIcon from "@mui/icons-material/FilterList"
import CloseIcon from "@mui/icons-material/Close"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import { useGetProductsQuery, useGetCategoriesQuery } from "@/store/services/productsApi"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  setMinRating,
  resetFilters,
} from "@/store/slices/filtersSlice"
import { toggleCart } from "@/store/slices/cartSlice"
import ProductCard from "@/components/ProductCard"
import ProductDetailModal from "@/components/ProductDetailModal"
import CartDrawer from "@/components/CartDrawer"
import type { Product } from "@/store/services/productsApi"

export default function Home() {
  const dispatch = useAppDispatch()
  const { data: products, isLoading, error } = useGetProductsQuery()
  const { data: categories } = useGetCategoriesQuery()
  const filters = useAppSelector((state) => state.filters)
  const cartItems = useAppSelector((state) => state.cart.items)
  const isCartOpen = useAppSelector((state) => state.cart.isOpen)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Filter products
  const filteredProducts = products?.filter((product) => {
    // Search filter
    const matchesSearch =
      product.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = filters.selectedCategory === "all" || product.category === filters.selectedCategory

    // Price filter
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]

    // Rating filter
    const matchesRating = !product.rating || product.rating.rate >= filters.minRating

    return matchesSearch && matchesCategory && matchesPrice && matchesRating
  })

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    dispatch(setPriceRange(newValue as [number, number]))
  }

  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    dispatch(setMinRating(newValue || 0))
  }

  const activeFiltersCount = [
    filters.searchQuery !== "",
    filters.selectedCategory !== "all",
    filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000,
    filters.minRating !== 0,
  ].filter(Boolean).length

  const FilterSection = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        {activeFiltersCount > 0 && (
          <Chip
            label={`${activeFiltersCount} active`}
            size="small"
            color="primary"
            onDelete={() => dispatch(resetFilters())}
          />
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.selectedCategory}
            label="Category"
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories?.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom sx={{ fontWeight: 500 }}>
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom sx={{ fontWeight: 500 }}>
          Minimum Rating
        </Typography>
        <Rating value={filters.minRating} onChange={handleRatingChange} size="large" sx={{ mt: 1 }} />
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Product Dashboard
          </Typography>
          <Button
            component={Link}
            href="/admin"
            color="inherit"
            startIcon={<AdminPanelSettingsIcon />}
            sx={{ mr: 2, fontWeight: 600 }}
          >
            Admin
          </Button>
          <IconButton color="inherit" onClick={() => dispatch(toggleCart())} sx={{ mr: 1 }}>
            <Badge badgeContent={cartItemsCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Browse Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and manage your product catalog
          </Typography>
        </Box>

        <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton color="primary" onClick={() => setIsFilterDrawerOpen(true)} sx={{ display: { md: "none" } }}>
            <Badge badgeContent={activeFiltersCount} color="error">
              <FilterListIcon />
            </Badge>
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                position: "sticky",
                top: 80,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
              }}
            >
              <FilterSection />
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            )}

            {error && <Alert severity="error">Failed to load products. Please try again later.</Alert>}

            {filteredProducts && filteredProducts.length === 0 && (
              <Alert severity="info">No products found matching your filters.</Alert>
            )}

            <Grid container spacing={3}>
              {filteredProducts?.map((product) => (
                <Grid item xs={12} sm={6} lg={4} key={product.id}>
                  <ProductCard product={product} onViewDetails={() => setSelectedProduct(product)} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        sx={{ display: { md: "none" } }}
      >
        <Box sx={{ width: 320 }}>
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
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FilterSection />
        </Box>
      </Drawer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={() => dispatch(toggleCart())} />
    </>
  )
}
