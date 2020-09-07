import React from 'react';
import { Link } from 'react-router-dom';

import graphQlFetch from './graphQlFetch.js';
import NumberInput from './NumberInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';

async function loadData(id) {
    const query = `query issue($id: Int!) {
        issue(id: $id) {
            id title status owner effort created due description
        }
    }`;

    const data = await graphQlFetch(query, { id });
    console.log('IssueEdit:loadData result', data);

    if (data) {
        const { issue } = data;

        return issue;
    }

    return {};
}

const initialState = {
    data: {},
    isLoading: false,
    isError: false,
    invalidFields: new Set(), // Added for DateInput
};
function reducer(state, action) {
    switch (action.type) {
        case 'INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
                invalidFields: new Set(),
            };

        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                isError: false,
                invalidFields: new Set(),
            };

        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };

        case 'UPDATE_FIELD': {
            const { name, value } = action;

            return {
                ...state,
                data: {
                    ...state.data,
                    [name]: value,
                },
            };
        }

        case 'UPDATE_VALIDITY':
            return {
                ...state,
            };

        default:
            throw new Error();
    }
}

export default function IssueEdit({ match }) {
    const id = Number(match.params.id);

    const [issue, dispatchIssue] = React.useReducer(reducer, initialState);

    React.useEffect(() => {
        dispatchIssue({ type: 'INIT' });

        loadData(id).then((result) => {
            if (!result.id) {
                dispatchIssue({ type: 'FETCH_FAILURE' });
            } else {
                dispatchIssue({ type: 'FETCH_SUCCESS', payload: result });
            }
        });
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(issue.data);
    };

    /**
     * Handle form input change by updating state
     *
     * @param {Event} event Event handler
     * @param {String} naturalValue Passed from a custom component; Parsed or modified value that
     * should take precedence over target.value.
     */
    const handleChange = (event, naturalValue = null) => {
        console.log('handleChange', event.target, naturalValue);
        const { name, value: textValue } = event.target;
        const value = naturalValue || textValue;

        dispatchIssue({ type: 'UPDATE_FIELD', name, value });
    };

    /**
     * Manage state
     * @param {Event} event Event object
     * @param {Boolean} isValid Checks if value is valid based on input type
     */
    const handleValidityChange = (event, isValid) => {
        const { name } = event.target;

        dispatchIssue({ type: 'UPDATE_VALIDITY', name, isValid });
    };

    return (
        <div>
            <h2>{`Edit Issue #[${id}]`}</h2>

            {issue.isError && <p>Something went wrong.</p>}

            {issue.isLoading && <p>Loading</p>}

            {!issue.isError && !issue.isLoading && (
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Created:</td>
                                <td>{issue.data.created ? issue.data.created.toDateString() : ''}</td>
                            </tr>
                            <tr>
                                <td>Status:</td>
                                <td>
                                    <select name="status" value={issue.data.status} onChange={handleChange}>
                                        <option value="New">New</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="Fixed">Fixed</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Owner:</td>
                                <td>
                                    <TextInput key={id} name="owner" value={issue.data.owner} onChange={handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>Effort:</td>
                                <td>
                                    <NumberInput key={id} name="effort" value={issue.data.effort} onChange={handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>Due:</td>
                                <td>
                                    <DateInput key={id} name="due" value={issue.data.due} onChange={handleChange} onValidityChange={handleValidityChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>Title:</td>
                                <td>
                                    <TextInput key={id} name="title" value={issue.data.title} onChange={handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>Description:</td>
                                <td>
                                    <TextInput key={id} tag="textarea" name="description" value={issue.data.description} onChange={handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <td />
                                <td><button type="submit">Submit</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <Link to={`/edit/${id - 1}`}>Prev</Link>
                    {' | '}
                    <Link to={`/edit/${id + 1}`}>Next</Link>
                    <p>{JSON.stringify(issue.data)}</p>
                </form>
            )}
        </div>
    );
}
