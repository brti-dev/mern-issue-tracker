import React from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Navigation and functions for filtering IssueTable.
 * Component not a <Route> so need to pass through withRouter function to get
 * access to props.history.
 *
 * @param {Object} props Props supplied by React Router via withRouter method
 */
function IssueFilter(props) {
    console.log('IssueFilter compontent', props);

    function onChangeStatus(element) {
        const status = element.target.value;
        const { history } = props;
        history.push({
            pathname: '/issues/',
            search: status ? `status=${status}` : '',
        });
    }

    return (
        <div>
            Status:&nbsp;
            <select onChange={onChangeStatus}>
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Closed">Closed</option>
            </select>
        </div>
    );
}

export default withRouter(IssueFilter);
