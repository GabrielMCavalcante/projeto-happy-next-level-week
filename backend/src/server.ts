import express from 'express'
import routes from './routes'
import path from 'path'
import 'express-async-errors'
import './database/connection'

const app = express()
const PORT = 3333

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(routes)

app.listen(PORT, () => console.log("Server started @PORT", PORT))