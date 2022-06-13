const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
//routes
const useRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')



dotenv.config()
mongoose.connect(process.env.MONGO__URL, {useNewUrlParser: true}, ()=> {
    console.log('mongodb connected')
})

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use('/api/users', useRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)







app.listen(3000, ()=> console.log('server ready'))