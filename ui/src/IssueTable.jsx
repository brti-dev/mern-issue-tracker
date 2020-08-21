/* globals React */

import graphQlFetch from './graphQlFetch.js';

async function fetchIssues() {
    const query = 'query { issueList { id title status, owner, created, effort, due } }';

    const data = await graphQlFetch(query);

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

function IssueRow({ issue }) {
    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created}</td>
            <td>{issue.effort}</td>
            <td>{issue.due && issue.due}</td>
            <td>{issue.title}</td>
        </tr>
    );
}

export default function IssueTable() {
    const [issues, dispatchIssues] = React.useReducer(issuesReducer, { data: [] });
    console.log('State: issues', issues);

    React.useEffect(() => {
        fetchIssues().then((result) => {
            dispatchIssues({ type: 'FETCH_SUCCESS', payload: result });
        });
    }, []);

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
            fetchIssues().then((payload) => {
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
