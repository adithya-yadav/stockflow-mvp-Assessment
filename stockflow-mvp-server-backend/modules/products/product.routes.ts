import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.middleware'
import { getProducts, createProduct, updateProduct, deleteProduct } from './product.controller'

const router = Router()

router.use(authMiddleware)
router.get('/', getProducts)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
