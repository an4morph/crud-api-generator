const express = require('express')
const app = express()
const port = 1717
const defaultData = require('./db/defaultData')
const cors = require('cors')
const auth = require('./routes/auth')
const resourceRoute = require('./routes/resource')
const db = require('./db')
const { resource, schema, generator } = require('./settings.js')

const toKeys = (obj) => Object.keys(obj).join(' ')
if (toKeys(schema) !== toKeys(generator())) throw new Error('Your schema and generator should match keys')

app.use(cors())
db.defaults(defaultData).write()

app.use(express.json()) 

app.get('/me', auth.me)
app.post('/login', auth.login)
app.post('/signin', auth.signin)

app.get(`/${resource}`, resourceRoute.getAll)
app.get(`/${resource}/detail/:id`, resourceRoute.getItem)
app.post(`/${resource}/create`, resourceRoute.createNew)
app.put(`/${resource}/update/:id`, resourceRoute.updateItem)
app.delete(`/${resource}/delete/:id`, resourceRoute.deleteItem)


app.listen(port, () => console.log(`App listening at http://localhost:${port}`))