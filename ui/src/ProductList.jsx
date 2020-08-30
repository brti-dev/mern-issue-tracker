import React from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { Route, useRouteMatch } from 'react-router-dom';

import ProductFilter from './ProductFilter.jsx';
import ProductTable from './ProductTable.jsx';

/**
 * <Route> component
 * @param {Object} props Includes props supplied by React Router for component
 * to handle (`Contents` component).
 */
export default function ProductList(props) {
    /** @param location Object from React Router with qs params */
    /** @param search Query string */
    const { location: { search } } = props;

    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('category')) {
        vars.category = params.get('category');
    }

    /**
     * @param path Allows building <Route> paths relative to parent route.
     * @param url Build relative links
     */
    const { path } = useRouteMatch();

    return (
        <>
            <h1>Products</h1>
            <ProductFilter />
            <ProductTable vars={vars} />
            {/* <Route path={`${path}/:id`} component={ProductDetail} /> */}
        </>
    );
}
