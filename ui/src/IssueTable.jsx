import React from 'react';

import { Link, NavLink, withRouter } from 'react-router-dom';

import graphQlFetch from './graphQlFetch.js';

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

    if (data) {
        console.log('fetchIssues result:', data);
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

        case 'CREATE':
            break;

        default:
            throw new Error();
    }

    return {};
}

const IssueRow = withRouter((props) => {
    console.log('<IssueRow>', props);

    const { issue, location: { search } } = props;

    const selectLocation = { pathname: `/issues/${issue.id}`, search };

    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created}</td>
            <td>{issue.effort}</td>
            <td>{issue.due && issue.due}</td>
            <td>{issue.title}</td>
            <td>
                <Link to={`/edit/${issue.id}`}>Edit</Link>
                <span>|</span>
                <NavLink to={selectLocation}>Select</NavLink>
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

    React.useEffect(() => {
        fetchIssues(vars).then((result) => {
            dispatchIssues({ type: 'FETCH_SUCCESS', payload: result });
        });
    }, [vars]);

    const issueRows = issues.data.map((issue) => <IssueRow key={issue.id} issue={issue} />);

    const formRef = React.useRef();

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = formRef.current;
        const issue = {
            owner: form.owner.value,
            title: form.title.value,
            due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
        };

        console.log('Create issue', issue);

        const query = `mutation issueAdd($issue: IssueInputs!) {
            issueAdd(issue: $issue) {
                id
            }
        }`;

        graphQlFetch(query, { issue }).then((result) => {
            console.log('mutation issueAdd response', result);
            fetchIssues(vars).then((payload) => {
                dispatchIssues({ type: 'FETCH_SUCCESS', payload });
            });
        });
    };

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
            <form ref={formRef} onSubmit={handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" />
                <input type="text" name="title" placeholder="Title" />
                <button type="submit">Add</button>
            </form>
        </>
    );
}
