import React from 'react';

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';

/**
 * @param {Object} props Includes props supplied by React Router for component
 * to handle (`Contents` component).
 */
export default function IssueList(props) {
    /** @param location Object from React Router with qs params */
    /** @param search Query string */
    const { location: { search } } = props;

    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) {
        vars.status = params.get('status');
    }

    return (
        <>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <IssueTable vars={vars} />
        </>
    );
}
