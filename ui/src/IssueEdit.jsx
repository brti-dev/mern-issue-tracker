import React from 'react';
import { Link } from 'react-router-dom';

import graphQlFetch from './graphQlFetch.js';
import NumberInput from './NumberInput.jsx';

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
        // Convert data to strings and perform null checks so variables can be used in HTML forms.
        issue.created = issue.created ? issue.created.toDateString() : '';
        issue.due = issue.due ? issue.due.toDateString() : '';
        issue.owner = issue.owner != null ? issue.owner : '';
        issue.description = issue.description != null ? issue.description : '';

        return issue;
    }

    return {};
}

const initialState = {
    data: {},
    isLoading: false,
    isError: false,
};
function reducer(state, action) {
    switch (action.type) {
        case 'INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };

        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                isError: false,
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

    const handleChange = (event, naturalValue) => {
        console.log('handleChange', event.target, naturalValue);
        const { name, value: textValue } = event.target;
        const value = naturalValue === undefined ? textValue : naturalValue;

        dispatchIssue({ type: 'UPDATE_FIELD', name, value });
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
                                <td>{issue.data.created}</td>
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
                                    <input type="text" name="owner" value={issue.data.owner} onChange={handleChange} />
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
                                    <input type="date" name="due" value={issue.data.due} onChange={handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>Title:</td>
                                <td>
                                    <input type="text" name="title" value={issue.data.title} onChange={handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>Description:</td>
                                <td>
                                    <textarea name="description" value={issue.data.description} onChange={handleChange} />
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
