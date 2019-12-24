import express from 'express'
import expressGraphQL from 'express-graphql'
import schema from './schema.js'

const app = express()

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true,
}))

app.listen(4000, () => {
    console.log('Server is running on port 4000..')
})
