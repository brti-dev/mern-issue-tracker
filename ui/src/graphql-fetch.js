const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) {
        return new Date(value);
    }

    return value;
}

/**
 * Common utility function to handle API calls and report errors.
 * @param {String} query GraphQL query
 * @param {Object} variables Variables
 * @param {Function} showError Callback function to handle errors
 */
async function graphQlFetch(query, variables = {}, showError = null) {
    try {
        const response = await fetch(window.ENV.UI_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });
        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver);

        if (result.errors) {
            const error = result.errors[0];
            if (error.extensions.code === 'BAD_USER_INPUT') {
                const details = error.extensions.exception.errors.join('\n ');
                if (showError) {
                    showError(`${error.message}: ${details}`, 'BAD_USER_INPUT');
                }
            } else if (showError) {
                showError(`${error.extensions.code}: ${error.message}`);
            }
        }

        return result.data;
    } catch (e) {
        if (showError) showError(`Error ${e.message}`);

        return null;
    }
}

export { graphQlFetch as default };
