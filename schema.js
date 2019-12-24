import graphQL from 'graphql'
import axios from 'axios'

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLNonNull 
} = graphQL

const CustomerType = new GraphQLObjectType({
     name: 'Customer',
     fields: () => ({
         id: {type: GraphQLString},
         name: {type: GraphQLString},
         email: {type: GraphQLString},
         age: {type: GraphQLInt}
     })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: {type: GraphQLString}
            },
            async resolve(parentValue, args) {
                const res = await axios.get('http://localhost:3000/customers/' + args.id)
                return res.data 
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            async resolve(parentValue, args) {
                const res = await axios.get('http://localhost:3000/customers')
                return res.data
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            async resolve(parentValue, args) {
                const res = await axios.post('http://localhost:3000/customers', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                return res.data
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            async resolve(parentValue, args) {
                const res = await axios.delete('http://localhost:3000/customers/' + args.id)
                return res.data
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt},
            },
            async resolve(parentValue, args) {
                const res = await axios.patch('http://localhost:3000/customers/' + args.id, args)
                return res.data
            }
        }
    }
})

export default new GraphQLSchema({
    query: RootQuery,
    mutation
})