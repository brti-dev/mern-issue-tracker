import React from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import scrollToTop from './scroll-to-top.js';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
        display: 'flex',
        '& > *:not(:first-child)': {
            marginLeft: theme.spacing(1),
        },
        '& > *:first-child': {
            flexGrow: 1,
        },
    },
}));

export default function IssuePagination({ page, count }) {
    if (count === 1) {
        return '';
    }

    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();

    function navigate(toPage) {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('page', toPage);
        history.push({
            pathname: location.pathname,
            search: queryParams.toString(),
        });
        scrollToTop();
    }

    return (
        <div className={classes.root}>
            <div>
                Page {page} of {count}
            </div>
            {page !== 1 && <Button variant="contained" color="primary" onClick={() => navigate(page - 1)}>Previous</Button>}
            {page !== count && <Button variant="contained" color="primary" onClick={() => navigate(page + 1)}>Next</Button>}
        </div>
    );
}
