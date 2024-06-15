import { configDotenv } from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
configDotenv() // initialize dotenv before everything else

import express from 'express'
import expressSession from 'express-session' 

import { stripeRoute } from './routes/stripe'
import { spotifyRoute } from './routes/spotify'

const app = express()

app.use(express.json())
app.use(expressSession({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    genid: () => {
        return uuidv4()
    }
}))

app.get("/", (req, res) => {
    res.send("Success")
})

app.use('/stripe',stripeRoute)
app.use('/spotify',spotifyRoute)

app.listen(3000)
