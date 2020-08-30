import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ProductList from './ProductList.jsx';
import IssueList from './IssueList.jsx';
import IssueReport from './IssueReport.jsx';
import IssueEdit from './IssueEdit.jsx';

const Home = () => (
    <>
        <h1>Camval Produce</h1>
        <p>Welcome</p>
    </>
);

const NotFound = () => <h1>Page Not Found</h1>;

export default function Contents() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/products" component={ProductList} />
            {/* <Redirect exact from="/" to="/issues" />
            <Route path="/issues" component={IssueList} />
            <Route path="/edit/:id" component={IssueEdit} />
            <Route path="/report" component={IssueReport} /> */}
            <Route component={NotFound} />
        </Switch>
    );
}
