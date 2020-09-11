import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

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
    const data = await graphQlFetch(query, vars);
    console.log('fetchIssues result:', data);

    if (data) {
        return data.issueList;
    }

    return {};
}

function issuesReducer(state, action) {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.payload,
            };

        case 'CLOSE_ISSUE':
            return {
                ...state,
                data: state.data.map((issue) => {
                    if (issue.id === action.payload.id) {
                        return action.payload;
                    }

                    return issue;
                }),
            };

        case 'CREATE':
            break;

        default:
            throw new Error();
    }

    return {};
}

const IssueRow = withRouter((props) => {
    console.log('<IssueRow>', props);

    const {
        issue,
        location: { search },
        closeIssue,
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
            </td>
        </tr>
    );
});

/**
 * @param {Object} vars Variables passed by parent Component `IssueList`
 */
export default function IssueTable({ vars }) {
    console.log('<IssueTable>', vars);

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

        const data = await graphQlFetch(query, { id });
        if (data) {
            dispatchIssues({
                type: 'CLOSE_ISSUE',
                payload: data.issueUpdate,
            });
        } else {
            handleFetchIssues();
        }
    };

    const issueRows = issues.data.map((issue) => (
        <IssueRow key={issue.id} issue={issue} closeIssue={closeIssue} />
    ));

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
