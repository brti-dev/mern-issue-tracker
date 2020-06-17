const initialIssues = [
    {
        id: 1,
        status: 'New',
        owner: 'Ravan',
        effort: 5,
        created: new Date('2019-01-15'),
        due: undefined,
        title: 'Error in console when clicking "Add"',
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Eddie',
        effort: 14,
        created: new Date('2019-01-16'),
        due: new Date('2019-02-16'),
        title: 'Missing bottom border panel',
    }
]

const sampleIssue = {...initialIssues[0], status: 'New', owner: 'Pieta'}

function loadData() {
    return new Promise((resolve, reject) =>
        setTimeout(
            () => resolve({ data: initialIssues }),
            1000
        )
    )
}

function IssueFilter() {
    return <div>foo</div>
}

function IssueTable() {
    const [issues, setIssues] = React.useState([]);

    React.useEffect(() => {
        loadData().then(result => {
            setIssues(result.data)
        })
    }, [])

    const createIssue = (issue) => {
        issue.id = issues.length + 1;
        issue.created = new Date();
        const newIssueList = issues.slice();
        newIssueList.push(issue);
        setIssues(newIssueList);
    }

    const issueRows = issues.map(issue => 
        <IssueRow key={issue.id} issue={issue} />
    )

    const formRef = React.useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        const form = formRef.current
        const issue = {
            owner: form.owner.value,
            title: form.title.value,
            status: 'New',
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
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.due && issue.due.toDateString()}</td>
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