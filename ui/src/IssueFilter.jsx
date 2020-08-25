import React from 'react';

export default function IssueFilter() {
    return (
        <div>
            <a href="/#/issues">All Issues</a>
            {' | '}
            <a href="/#/issues?status=New">New Issues</a>
            {' | '}
            <a href="/#/issues?status=Assigned">Assigned Issues</a>
        </div>
    );
}
