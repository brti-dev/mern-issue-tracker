const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) {
        return new Date(value);
    }

    return value;
}

function loadData() {
    const query = 'query { issueList { id title status, owner, created, effort, due } }'
    
    return new Promise((resolve, reject) => {
        fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query })
        }).then(response => response.text())
        .then(data => {
            const json = JSON.parse(data, jsonDateReviver);
            return resolve(json)
        })
    })
}

function IssueFilter() {
    return <div>foo</div>
}

function IssueTable() {
    const [issues, setIssues] = React.useState([]);

    React.useEffect(() => {
        loadData().then(result => {
            console.log('loadData result:', result)
            setIssues(result.data.issueList)
        })
    }, [])

    const issueRows = issues.map(issue => 
        <IssueRow key={issue.id} issue={issue} />
    )

    const createIssue = (issue) => {
        console.log('createIssue', issue);
        
        const query = `mutation issueAdd($issue: IssueInputs!) {
            issueAdd(issue: $issue) {
                id
            }
        }`
    
        fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query, variables: { issue } })
        }).then(response =>response.json())
        .then(data => {
            console.log('mutation issueAdd response', data)
            loadData().then(result => setIssues(result.data.issueList));
        })
    }

    const formRef = React.useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = formRef.current
        const issue = {
            owner: form.owner.value,
            title: form.title.value,
            due: new Date(new Date().getTime() + 1000*60*60*24*10),
        }
        createIssue(issue)
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
    )
}

function IssueRow({issue}) {
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
    )
}

const element = (
    <IssueList />
)

ReactDOM.render(element, document.getElementById('root'))