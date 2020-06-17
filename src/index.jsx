function IssueFilter() {
    return <div>foo</div>
}

function IssueTable() {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                <IssueRow issue_id={1} issue_title="Error foo" />
                <IssueRow issue_id={2} issue_title="Error bar" />
            </tbody>
        </table>
    )
}

function IssueAdd() {
    return <div>foo</div>
}

function IssueList() {
    return (
        <>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <IssueTable />
            <IssueAdd />
        </>
    )
}

const element = (
    <IssueList />
)

ReactDOM.render(element, document.getElementById('root'))