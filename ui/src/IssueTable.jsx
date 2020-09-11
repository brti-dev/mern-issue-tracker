import React from 'react';
import { Link, NavLink, withRouter, useHistory, useLocation } from 'react-router-dom';

import graphQlFetch from './graphQlFetch.js';
import IssueAdd from './IssueAdd.jsx';

async function fetchIssues(vars = {}) {
    console.log('fetchIssues', vars);

    const query = `query issueList(
        $status: StatusType
        $effortMin: Int
        $effortMax: Int
    ) {
        issueList(
            status: $status
            effortMin: $effortMin,
            effortMax: $effortMax
        ) {
            id title status owner created effort due
        }
    }`;
    const result = await graphQlFetch(query, vars);
    console.log('fetchIssues result:', result);

    if (result) {
        return result.issueList;
    }

    return {};
}

function issuesReducer(state, action) {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isError: false,
                data: action.payload,
            };

        case 'CLOSE_ISSUE':
            return {
                ...state,
                isError: false,
                data: state.data.map((issue) => {
                    if (issue.id === action.payload.id) {
                        return action.payload;
                    }

                    return issue;
                }),
            };

        case 'DELETE':
            return {
                ...state,
                isError: false,
                data: state.data.filter((issue) => issue.id !== action.id),
            };

        case 'FAILURE':
            return {
                ...state,
                isError: true,
            };

        default:
            throw new Error();
    }
}

const IssueRow = withRouter((props) => {
    console.log('<IssueRow>', props);

    const {
        issue,
        location: { search },
        closeIssue,
        deleteIssue,
    } = props;

    const selectLocation = { pathname: `/issues/${issue.id}`, search };

    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.due && issue.due.toDateString()}</td>
            <td>{issue.title}</td>
            <td>
                <Link to={`/edit/${issue.id}`}>Edit</Link>
                <span>|</span>
                <NavLink to={selectLocation}>Select</NavLink>
                <span>|</span>
                <button type="button" disabled={issue.status === 'Closed'} onClick={() => { closeIssue(issue.id); }}>Close</button>
                <button type="button" onClick={() => { deleteIssue(issue.id); }}>Delete</button>
            </td>
        </tr>
    );
});

/**
 * @param {Object} vars Filters passed by parent Component `IssueList`
 */
export default function IssueTable({ vars }) {
    console.log('<IssueTable>', vars);

    const history = useHistory();
    const location = useLocation();

    const [issues, dispatchIssues] = React.useReducer(issuesReducer, { data: [] });
    console.log('State: issues', issues);

    const handleFetchIssues = React.useCallback(() => {
        fetchIssues(vars).then((result) => {
            dispatchIssues({ type: 'FETCH_SUCCESS', payload: result });
        });
    }, [vars]);

    React.useEffect(() => {
        handleFetchIssues();
    }, [handleFetchIssues]);

    const closeIssue = async (id) => {
        const query = `mutation issueClose($id: Int!) {
            issueUpdate(id: $id, changes: { status: Closed }) {
                id title status owner effort created due description
            }
        }`;

        /**
         * @returns { "data": { "issueUpdate": Issue! } }
         */
        const result = await graphQlFetch(query, { id });
        if (result) {
            dispatchIssues({ type: 'CLOSE_ISSUE', payload: result.issueUpdate });
        } else {
            dispatchIssues({ type: 'FAILURE' });
        }
    };

    const deleteIssue = async (id) => {
        const query = `mutation issueDelete($id: Int!) {
            issueDelete(id: $id)
        }`;

        /**
         * @returns { "data": { "issueDelete": Boolean } }
         */
        const result = await graphQlFetch(query, { id });
        if (result && result.issueDelete) {
            dispatchIssues({ type: 'DELETE', id });

            if (location.pathname === `/issues/${id}`) {
                history.push({ pathname: '/issues', search: location.search });
            }
        } else {
            dispatchIssues({ type: 'FAILURE' });
        }
    };

    const issueRows = issues.data.map((issue) => (
        <IssueRow key={issue.id} issue={issue} closeIssue={closeIssue} deleteIssue={deleteIssue} />
    ));

    if (issues.isFailure) {
        return <p>Something went wrong.</p>;
    }

    return (
        <>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Created</th>
                        <th>Effort</th>
                        <th>Due Date</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {issueRows}
                </tbody>
            </table>
            <IssueAdd onAdd={handleFetchIssues} />
        </>
    );
}
