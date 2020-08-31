import React from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { withRouter } from 'react-router-dom';

/**
 * Navigation and functions for filtering IssueTable.
 * Component not a <Route> so need to pass through withRouter function to get
 * access to props.history.
 *
 * @param {Object} props Props supplied by React Router via withRouter method
 */
const IssueFilter = withRouter((props) => {
    console.log('IssueFilter compontent', props);

    // Read location qs to determine selectform value
    const { location: { search } } = props;
    const queryParams = new URLSearchParams(search);
    const [status, setStatus] = React.useState(queryParams.get('status') || '');

    // Change state:status
    function onChangeStatus(element) {
        setStatus(element.target.value);
    }

    // Change URL and apply filter based on state:status
    function applyFilter() {
        const { history } = props;
        history.push({
            pathname: '/issues/',
            search: status ? `status=${status}` : '',
        });
    }

    return (
        <div>
            Status:&nbsp;
            <select value={status} onChange={onChangeStatus}>
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Closed">Closed</option>
            </select>
            <button type="button" onClick={applyFilter}>Apply</button>
        </div>
    );
});

export default IssueFilter;
