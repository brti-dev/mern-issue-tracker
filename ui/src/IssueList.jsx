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
    /** @param location Object from React Router with qs params */
    /** @param search Query string */
    const { location: { search } } = props;

    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) {
        vars.status = params.get('status');
    }

    /**
     * @param path Allows building <Route> paths relative to parent route.
     * @param url Build relative links
     */
    const { path } = useRouteMatch();

    return (
        <>
            <h1>Issue Tracker</h1>
            <IssueFilter />
            <IssueTable vars={vars} />
            <Route path={`${path}/:id`} component={IssueDetail} />
        </>
    );
}
