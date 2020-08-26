import React from 'react';
import Contents from './Contents.jsx';

function NavBar() {
    return (
        <nav>
            <a href="/">Home</a>
            <span>|</span>
            <a href="/#/issues">Issue List</a>
            <span>|</span>
            <a href="/#/report">Report</a>
        </nav>
    );
}

export default function Page() {
    return (
        <div>
            <NavBar />
            <Contents />
        </div>
    );
}
