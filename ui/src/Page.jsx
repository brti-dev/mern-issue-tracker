import React from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';

import Contents from './Contents.jsx';

function NavBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h5">
                    Issue Tracker{' '}
                    <Chip label="MERN!" color="secondary" size="small" />
                </Typography>
                <Typography>
                    <NavLink to="/issues">Issue List</NavLink>{' '}
                    <NavLink to="/report">Report</NavLink>
                </Typography>
            </Toolbar>
        </AppBar>
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
