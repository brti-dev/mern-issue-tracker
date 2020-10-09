import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IssueFilter from './IssueFilter.jsx';
import graphQlFetch from './graphql-fetch.js';

const STATUSES = ['New', 'Assigned', 'Fixed', 'Closed'];

async function fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) {
        vars.status = params.get('status');
    }
    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) {
        vars.effortMin = effortMin;
    }
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) {
        vars.effortMax = effortMax;
    }

    const query = `query issueList(
        $status: StatusType
        $effortMin: Int
        $effortMax: Int
    ) {
        issueCounts(
            status: $status
            effortMin: $effortMin
            effortMax: $effortMax
        ){ owner New Assigned Fixed Closed }
    }`;
    const data = await graphQlFetch(query, vars, showError);

    return data;
}

export default function IssueReport(props) {
    const {
        location: { search }, match, showError,
    } = props;

    const [state, setState] = React.useState({ stats: [] });

    const handleFetchReport = React.useCallback(() => {
        fetchData(match, search, showError).then((result) => {
            if (result) {
                setState({ stats: result.issueCounts });
            }
        });
    }, []);

    React.useEffect(() => {
        handleFetchReport();
    }, [handleFetchReport]);

    if (state.stats == null) {
        return null;
    }

    return (
        <div id="report">
            <IssueFilter urlBase="/report" />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {STATUSES.map((status) => <TableCell key={status}>{status}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.stats.map((counts) => (
                        <TableRow key={counts.owner}>
                            <TableCell>{counts.owner}</TableCell>
                            {STATUSES.map((status) => (
                                <TableCell key={status}>{counts[status]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
