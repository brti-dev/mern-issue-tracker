import React from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { Route, useRouteMatch } from 'react-router-dom';

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueDetail from './IssueDetail.jsx';

/**
 * <Route> component
 * @param {Object} props Includes props supplied by React Router for component
 * to handle (`Contents` component).
 */
export default function IssueList(props) {
    console.log('<IssueList>', props);

    /** @param location Object from React Router with qs params */
    /** @param search Query string */
    const { location: { search } } = props;

    const queryParams = new URLSearchParams(search);
    const vars = {};

    // Querystring: parse `status`
    if (queryParams.get('status')) {
        vars.status = queryParams.get('status');
    }

    // Querystring: parse `effortmin` and `effortmax`
    const effortMin = parseInt(queryParams.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) {
        vars.effortMin = effortMin;
    }
    const effortMax = parseInt(queryParams.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) {
        vars.effortMax = effortMax;
    }

    /**
     * Route match object
     * Info about how <Route path> matched URL.
     * This route: <Route path="/issues" component={IssueList} />
     *
     * @param path Allows building <Route> paths relative to parent route.
     * @param url Build relative links
     */
    const { match: { path, url } } = props;

    return (
        <>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <IssueTable vars={vars} />
            {/* If the URL matches path, render this component */}
            <Route path={`${path}/:id`} component={IssueDetail} />
        </>
    );
}
