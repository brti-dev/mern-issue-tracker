const aboutMessage = 'Issue Tracker API v1.0';

/**
 * Resolver function
 * @param {Object} obj Conains the result returned from the resolver on the parent field
 * @param {Object} args Arguments passed into the field in the query
 * @param {Object} context
 * @param {*} info
 */
function setMessage(_, { message }) {
    return message;
}

function getMessage() {
    return aboutMessage;
}

module.exports = { setMessage, getMessage };
