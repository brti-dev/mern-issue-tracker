import React from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Navigation and functions for filtering ProductTable.
 * Component not a <Route> so need to pass through withRouter function to get
 * access to props.history.
 *
 * @param {Object} props Props supplied by React Router via withRouter method
 */
function ProductFilter(props) {
    /**
     * Execute selectform change by manipulating route history
     *
     * @param {*} element DOM element
     */
    function onChangeStatus(element) {
        const category = element.target.value;
        const { history } = props;
        history.push({
            pathname: '/products/',
            search: category ? `category=${category}` : '',
        });
    }

    return (
        <div>
            Show:&nbsp;
            <select onChange={onChangeStatus}>
                <option value="">All</option>
                <option value="fruit">Fruits</option>
                <option value="vegetable">Vegetables</option>
                <option value="other">Other</option>
            </select>
        </div>
    );
}

export default withRouter(ProductFilter);
