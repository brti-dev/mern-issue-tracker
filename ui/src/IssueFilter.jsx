import React from 'react';
import { Link } from 'react-router-dom';

export default function IssueFilter() {
    return (
        <div>
            <Link to="/issues">All Issues</Link>
            <span>|</span>
            <Link to="/issues?status=New">New Issues</Link>
            <span>|</span>
            <Link to="/issues?status=Assigned">Assigned Issues</Link>
        </div>
    );
}
