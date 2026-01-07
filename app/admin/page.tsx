"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SearchIcon from "@mui/icons-material/Search"
import { useGetProductsQuery, useDeleteProductMutation } from "@/store/services/productsApi"
import type { Product } from "@/store/services/productsApi"
import ProductFormModal from "@/components/ProductFormModal"
import ConfirmDialog from "@/components/ConfirmDialog"

export default function AdminPage() {
  const { data: products, isLoading, error } = useGetProductsQuery()
  const [deleteProduct] = useDeleteProductMutation()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = (id: number) => {
    setProductToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap()
        setDeleteConfirmOpen(false)
        setProductToDelete(null)
      } catch (err) {
        console.error("Failed to delete product:", err)
      }
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const filteredProducts = products?.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <IconButton component={Link} href="/" color="inherit" sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Product Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, update, and delete products from your catalog
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
              size="large"
              sx={{ fontWeight: 600 }}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search products by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">Failed to load products. Please try again later.</Alert>}

        {filteredProducts && (
          <TableContainer component={Paper} sx={{ border: 1, borderColor: "divider" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: "contain",
                          bgcolor: "white",
                          borderRadius: 1,
                          p: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>#{product.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 300 }}>
                        {product.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.category} size="small" sx={{ textTransform: "capitalize" }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {product.rating ? (
                        <Box>
                          <Typography variant="body2">
                            ⭐ {product.rating.rate.toFixed(1)} ({product.rating.count})
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(product)} color="primary" size="small" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product.id)} color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredProducts && filteredProducts.length === 0 && (
          <Alert severity="info">No products found matching your search.</Alert>
        )}
      </Container>

      <ProductFormModal open={isFormOpen} onClose={handleCloseForm} product={editingProduct} />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  )
}
