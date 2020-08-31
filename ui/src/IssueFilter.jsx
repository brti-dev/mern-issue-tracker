import React from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { withRouter } from 'react-router-dom';

/* eslint "no-alert": "off" */

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

    const initialState = {
        status: queryParams.get('status') || '',
        effortMin: queryParams.get('effortMin') || '',
        effortMax: queryParams.get('effortMax') || '',
    };
    const [state, setState] = React.useState(initialState);

    // On form change, update state
    function handleChange(element) {
        const { name, value } = element.target;

        // Validate input
        if (name === 'effortMin' || name === 'effortMax') {
            if (!value.match(/^\d*$/)) {
                alert('Input field `effort` can only contain numbers');
                return false;
            }
        }

        setState({
            ...state,
            [name]: value,
        });

        return true;
    }

    // Change URL and apply filter based on state:status
    function applyFilter() {
        const { history } = props;

        const newQuery = new URLSearchParams();
        if (state.status) newQuery.set('status', state.status);
        if (state.effortMin) newQuery.set('effortMin', state.effortMin);
        if (state.effortMax) newQuery.set('effortMax', state.effortMax);

        history.push({
            pathname: '/issues/',
            search: newQuery.toString(),
        });
    }

    return (
        <div>
            Status:&nbsp;
            <select name="status" value={state.status} onChange={handleChange}>
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Closed">Closed</option>
            </select>
            Effort between:
            <input type="number" size={5} name="effortMin" value={state.effortMin} onChange={handleChange} />
            {' - '}
            <input type="number" size={5} name="effortMax" value={state.effortMax} onChange={handleChange} />
            <button type="button" onClick={applyFilter}>Apply</button>
        </div>
    );
});

export default IssueFilter;
