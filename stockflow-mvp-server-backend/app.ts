import express from 'express'
import cors from 'cors'

import authRoutes from './modules/auth/auth.routes'
import productRoutes from './modules/products/product.routes'
import dashboardRoutes from './modules/dashboard/dashboard.routes'
import settingsRoutes from './modules/settings/settings.routes'

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://graceful-kangaroo-80b1af.netlify.app',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/settings', settingsRoutes)

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'StockFlow API running' })
})

export default app
