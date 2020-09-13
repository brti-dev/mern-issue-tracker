import Collapse from '@material-ui/core/Collapse';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

import React from 'react';
import { Link, NavLink, withRouter, useHistory, useLocation } from 'react-router-dom';

import graphQlFetch from './graphQlFetch.js';
import IssueAdd from './IssueAdd.jsx';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});
const useAddformStyles = makeStyles((theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    paper: {
        position: 'absolute',
        // width: 400,
        top: 50,
        left: 50,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 4, 3),
    },
}));

async function fetchIssues(vars = {}) {
    console.log('fetchIssues', vars);

    const query = `query issueList(
        $status: StatusType
        $effortMin: Int
        $effortMax: Int
    ) {
        issueList(
            status: $status
            effortMin: $effortMin,
            effortMax: $effortMax
        ) {
            id title status owner created effort due description
        }
    }`;
    const result = await graphQlFetch(query, vars);
    console.log('fetchIssues result:', result);

    if (result) {
        return result.issueList;
    }

    return {};
}

function issuesReducer(state, action) {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isError: false,
                data: action.payload,
            };

        case 'CLOSE_ISSUE':
            return {
                ...state,
                isError: false,
                data: state.data.map((issue) => {
                    if (issue.id === action.payload.id) {
                        return action.payload;
                    }

                    return issue;
                }),
            };

        case 'DELETE':
            return {
                ...state,
                isError: false,
                data: state.data.filter((issue) => issue.id !== action.id),
            };

        case 'FAILURE':
            return {
                ...state,
                isError: true,
            };

        default:
            throw new Error();
    }
}

const IssueRow = (props) => {
    console.log('<IssueRow>', props);

    const {
        issue,
        closeIssue,
        deleteIssue,
    } = props;
    const history = useHistory();
    const classes = useRowStyles();

    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{issue.id}</TableCell>
                <TableCell>{issue.status}</TableCell>
                <TableCell>{issue.owner}</TableCell>
                <TableCell>{issue.created.toDateString()}</TableCell>
                <TableCell>{issue.effort}</TableCell>
                <TableCell>{issue.due && issue.due.toDateString()}</TableCell>
                <TableCell>{issue.title}</TableCell>
                <TableCell>
                    <IconButton aria-label="Edit issue" onClick={() => history.push(`/edit/${issue.id}`)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="Close issue" disabled={issue.status === 'Closed'} onClick={() => { closeIssue(issue.id); }}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => { deleteIssue(issue.id); }}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={9} style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Collapse in={open}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{ border: 0, whiteSpace: 'pre', paddingTop: 0 }}>
                                        {issue.description || 'No description'}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

/**
 * @param {Object} vars Filters passed by parent Component `IssueList`
 */
export default function IssueTable({ vars }) {
    console.log('<IssueTable>', vars);

    const history = useHistory();
    const location = useLocation();
    const classes = useAddformStyles();

    const [issues, dispatchIssues] = React.useReducer(issuesReducer, { data: [] });
    const [openAdd, setOpenAdd] = React.useState(false);

    const handleFetchIssues = React.useCallback(() => {
        fetchIssues(vars).then((result) => {
            dispatchIssues({ type: 'FETCH_SUCCESS', payload: result });
        });
        setOpenAdd(false);
    }, [vars]);

    React.useEffect(() => {
        handleFetchIssues();
    }, [handleFetchIssues]);

    const closeIssue = async (id) => {
        const query = `mutation issueClose($id: Int!) {
            issueUpdate(id: $id, changes: { status: Closed }) {
                id title status owner effort created due description
            }
        }`;

        /**
         * @returns { "data": { "issueUpdate": Issue! } }
         */
        const result = await graphQlFetch(query, { id });
        if (result) {
            dispatchIssues({ type: 'CLOSE_ISSUE', payload: result.issueUpdate });
        } else {
            dispatchIssues({ type: 'FAILURE' });
        }
    };

    const deleteIssue = async (id) => {
        const query = `mutation issueDelete($id: Int!) {
            issueDelete(id: $id)
        }`;

        /**
         * @returns { "data": { "issueDelete": Boolean } }
         */
        const result = await graphQlFetch(query, { id });
        if (result && result.issueDelete) {
            dispatchIssues({ type: 'DELETE', id });

            if (location.pathname === `/issues/${id}`) {
                history.push({ pathname: '/issues', search: location.search });
            }
        } else {
            dispatchIssues({ type: 'FAILURE' });
        }
    };

    const issueRows = issues.data.map((issue) => (
        <IssueRow key={issue.id} issue={issue} closeIssue={closeIssue} deleteIssue={deleteIssue} />
    ));

    if (issues.isFailure) {
        return <p>Something went wrong.</p>;
    }

    return (
        <>
            <Table arial-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Effort</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {issueRows}
                </TableBody>
            </Table>
            <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
                <div className={classes.paper}>
                    <IssueAdd onAdd={handleFetchIssues} />
                </div>
            </Modal>
            <Fab color="secondary" aria-label="add issue" className={classes.fab} onClick={() => setOpenAdd(true)}>
                <AddIcon />
            </Fab>
        </>
    );
}
