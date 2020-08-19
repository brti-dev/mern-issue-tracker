const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const GraphQLDate = new GraphQLScalarType({
    name: 'Date',
    description: 'A Date() type in GraphQL as a scalar',
    parseValue(value) { // Value from the client
        const dateValue = new Date(value);
        return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
    },
    serialize(value) {
        return value.getTime(); // Value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            const value = new Date(ast.value);
            return Number.isNaN(value.getTime()) ? undefined : value;
        }
        return undefined;
    },
});

module.exports = GraphQLDate;
