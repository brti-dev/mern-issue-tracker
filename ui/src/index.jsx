/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) {
    return new Date(value);
  }

  return value;
}

// Common utility function
// Handles all API calls and reports errors
async function graphQLFetch(query, variables = {}) {
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
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    alert(`Error ${e.message}`);

    return null;
  }
}

function IssueFilter() {
  return <div>foo</div>;
}

async function fetchIssues() {
  const query = 'query { issueList { id title status, owner, created, effort, due } }';

  const data = await graphQLFetch(query);

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

function IssueTable() {
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

    graphQLFetch(query, { issue }).then((result) => {
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

function IssueList() {
  return (
    <>
      <h1>Issue Tracker</h1>
      <IssueFilter />
      <IssueTable />
    </>
  );
}

const element = (
  <IssueList />
);

ReactDOM.render(element, document.getElementById('root'));
