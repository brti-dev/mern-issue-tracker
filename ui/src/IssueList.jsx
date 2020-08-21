/* globals React */

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';

export default function IssueList() {
    return (
        <>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <IssueTable />
        </>
    );
}
