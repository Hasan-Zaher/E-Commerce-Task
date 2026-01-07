
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
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import FilterListIcon from "@mui/icons-material/FilterList"
import CloseIcon from "@mui/icons-material/Close"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import TuneIcon from "@mui/icons-material/Tune"
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
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
    rating: true,
  })

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Filter products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())

    const matchesCategory = filters.selectedCategory === "all" || product.category === filters.selectedCategory

    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]

    const matchesRating = !product.rating || product.rating.rate >= filters.minRating

    return matchesSearch && matchesCategory && matchesPrice && matchesRating
  })

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    dispatch(setPriceRange(newValue as [number, number]))
  }

  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    dispatch(setMinRating(newValue || 0))
  }

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const activeFiltersCount = [
    filters.searchQuery !== "",
    filters.selectedCategory !== "all",
    filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000,
    filters.minRating !== 0,
  ].filter(Boolean).length

  // FilterSection For Large Screens (Horizontal)
  const DesktopFilterSection = () => (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        width: "100%",
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 2,
      }}>
        {/* Category   */}
        <Box sx={{ flex: 1, minWidth: 0 }}>  
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.selectedCategory}
              label="Category"
              onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
              sx={{ width: '100%' }}
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

        {/* Price  */}
        <Box sx={{ flex: 1.2, minWidth: 0, px: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" noWrap>
            Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Typography>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            min={0}
            max={1000}
            size="small"
            sx={{ mt: 1, width: '100%' }}
          />
        </Box>

        {/* Rating  */}
        <Box sx={{ flex: 0.8, minWidth: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'start', gap: 1, justifyContent: 'center' }}>
            <Typography variant="caption" color="text.secondary"  >
              Rating:
            </Typography>
            <Rating
              value={filters.minRating}
              onChange={handleRatingChange}
              size="small"
            />
          </Box>
        </Box>

        {/* Active Filters  */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} active`}
              size="small"
              color="primary"
              onDelete={() => dispatch(resetFilters())}
            />
          )}
        </Box>
      </Box>
    </Paper>
  )

  // FilterSection for Small Screens (Vertical)
  const MobileFilterSection = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TuneIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
        </Box>
        {activeFiltersCount > 0 && (
          <Chip
            label={`${activeFiltersCount}`}
            size="small"
            color="primary"
            onDelete={() => dispatch(resetFilters())}
          />
        )}
      </Box>

      {/* Category Filter - Accordion */}
      <Accordion
        expanded={expandedFilters.category}
        onChange={() => toggleFilterSection('category')}
        sx={{
          mb: 2,
          bgcolor: 'transparent',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <Select
              value={filters.selectedCategory}
              onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
              displayEmpty
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories?.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Price Filter - Accordion */}
      <Accordion
        expanded={expandedFilters.price}
        onChange={() => toggleFilterSection('price')}
        sx={{
          mb: 2,
          bgcolor: 'transparent',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Typography>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            min={0}
            max={1000}
            valueLabelDisplay="auto"
            sx={{ mt: 1 }}
          />
        </AccordionDetails>
      </Accordion>

      {/* Rating Filter - Accordion */}
      <Accordion
        expanded={expandedFilters.rating}
        onChange={() => toggleFilterSection('rating')}
        sx={{
          mb: 2,
          bgcolor: 'transparent',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Minimum Rating</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Rating
              value={filters.minRating}
              onChange={handleRatingChange}
              size="large"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {filters.minRating}+ stars
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
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
          {/* Desktop Filters */}
          <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block", width: "100%" } }}>
            <Box
              sx={{
                position: "sticky",
                top: 80,
                borderRadius: 2,
                borderColor: "divider",
                width: "50%",
              }}
            >
              <DesktopFilterSection />
            </Box>
          </Grid>

          {/* Products Grid */}
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

            <Grid container spacing={3} sx={{  justifyContent: { xs: "center", sm: "flex-start" }  }}>
              {filteredProducts?.map((product) => (
                <Grid item xs={12} sm={6} lg={4} key={product.id} >
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
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            <MobileFilterSection />
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setIsFilterDrawerOpen(false)}
              sx={{ fontWeight: 600 }}
            >
              Apply Filters
            </Button>
          </Box>
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