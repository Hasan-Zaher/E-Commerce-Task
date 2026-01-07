"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import type { Product } from "@/store/services/productsApi"
import { useCreateProductMutation, useUpdateProductMutation, useGetCategoriesQuery } from "@/store/services/productsApi"

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  product: Product | null
}

export default function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const [createProduct, { isLoading: isCreating, error: createError }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation()
  const { data: categories } = useGetCategoriesQuery()

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        image: product.image,
      })
    } else {
      setFormData({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
      })
    }
  }, [product, open])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const productData = {
      title: formData.title,
      price: Number.parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      image: formData.image,
    }

    try {
      if (product) {
        await updateProduct({ id: product.id, product: productData }).unwrap()
      } else {
        await createProduct(productData).unwrap()
      }
      onClose()
    } catch (err) {
      console.error("Failed to save product:", err)
    }
  }

  const isValid = formData.title && formData.price && formData.description && formData.category && formData.image

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {product ? "Edit Product" : "Add New Product"}
        <IconButton onClick={onClose} sx={{ ml: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
          {(createError || updateError) && <Alert severity="error">Failed to save product. Please try again.</Alert>}

          <TextField
            label="Product Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            required
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            inputProps={{ min: 0, step: 0.01 }}
          />

          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => handleChange("category", e.target.value)}
            >
              {categories?.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <TextField
            label="Image URL"
            fullWidth
            required
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            helperText="Enter a valid image URL"
          />

          {formData.image && (
            <Box
              sx={{
                width: "100%",
                height: 200,
                bgcolor: "white",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Box
                component="img"
                src={formData.image}
                alt="Preview"
                sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                onError={(e: any) => {
                  e.target.style.display = "none"
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid || isCreating || isUpdating}
          sx={{ fontWeight: 600 }}
        >
          {isCreating || isUpdating ? <CircularProgress size={24} /> : product ? "Update Product" : "Create Product"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
