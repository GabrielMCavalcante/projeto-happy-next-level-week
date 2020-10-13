import express from 'express'
import routes from './routes'
import './database/connection'

const app = express()
const PORT = 3333

app.use(express.json())
app.use(routes)

app.listen(PORT, () => console.log("Server started @PORT", PORT))