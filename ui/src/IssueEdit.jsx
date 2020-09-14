/**
 * Component to edit an issue. Loads data from API into a form, then handles form submission by
 * sending changes to API.
 */

import React from 'react';
import { MenuItem, Snackbar, Select, Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import graphQlFetch from './graphQlFetch.js';
import NumberInput from './NumberInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        maxWidth: 300,
        '& > *': {
            marginTop: theme.spacing(2),
        },
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
}));

async function loadData(id) {
    const query = `query issue($id: Int!) {
        issue(id: $id) {
            id title status owner effort created due description
        }
    }`;

    const data = await graphQlFetch(query, { id });
    console.log('IssueEdit:loadData result', data);

    if (data) {
        const { issue } = data;

        return issue;
    }

    return {};
}

const initialState = {
    data: {},
    isLoading: false,
    isError: false,
    invalidFields: new Set(), // Added for DateInput
};
function reducer(state, action) {
    switch (action.type) {
        case 'INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
                invalidFields: new Set(),
            };

        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                isError: false,
                invalidFields: new Set(),
            };

        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };

        case 'UPDATE_FIELD': {
            const { name, value } = action;

            return {
                ...state,
                data: {
                    ...state.data,
                    [name]: value,
                },
            };
        }

        case 'UPDATE_VALIDITY':
            return {
                ...state,
            };

        default:
            throw new Error();
    }
}

export default function IssueEdit({ match }) {
    const classes = useStyles();
    const id = Number(match.params.id);
    const [issue, dispatchIssue] = React.useReducer(reducer, initialState);
    const [openAlert, setOpenAlert] = React.useState(false);

    React.useEffect(() => {
        dispatchIssue({ type: 'INIT' });

        loadData(id).then((result) => {
            if (!result.id) {
                dispatchIssue({ type: 'FETCH_FAILURE' });
            } else {
                dispatchIssue({ type: 'FETCH_SUCCESS', payload: result });
            }
        });
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (issue.invalidFields.size !== 0) {
            return;
        }

        dispatchIssue({ type: 'INIT' });

        const query = `mutation issueUpdate($id: Int!, $changes: IssueUpdateInputs!) {
            issueUpdate(id: $id, changes: $changes) {
              id title status owner effort created due description
            }
        }`;

        // Strip of fields that cannot be changed
        const { id: idStripped, created, ...changes } = issue.data;
        const result = await graphQlFetch(query, { changes, id });
        if (result) {
            console.log('mutation result', result);
            dispatchIssue({ type: 'FETCH_SUCCESS', payload: result.issueUpdate });
            setOpenAlert(true);
        }
    };

    /**
     * Handle form input change by updating state
     *
     * @param {Event} event Event handler
     * @param {String} naturalValue Passed from a custom component; Parsed or modified value that
     * should take precedence over target.value.
     */
    const handleChange = (event, naturalValue = null) => {
        console.log('handleChange', event.target, naturalValue);
        const { name, value: textValue } = event.target;
        const value = naturalValue || textValue;

        dispatchIssue({ type: 'UPDATE_FIELD', name, value });
    };

    /**
     * Manage state
     * @param {Event} event Event object
     * @param {Boolean} isValid Checks if value is valid based on input type
     */
    const handleValidityChange = (event, isValid) => {
        const { name } = event.target;

        dispatchIssue({ type: 'UPDATE_VALIDITY', name, isValid });
    };

    return (
        <div className={classes.root}>
            <h2>{`Edit Issue #${id}`}</h2>

            {issue.isError && <p>Something went wrong.</p>}

            {issue.isLoading && <p>Loading</p>}

            {!issue.isError && !issue.isLoading && (
                <form onSubmit={handleSubmit} className={classes.form}>
                    <div>
                        Created: {issue.data.created ? issue.data.created.toDateString() : ''}
                    </div>
                    <Select name="status" value={issue.data.status} onChange={handleChange}>
                        <MenuItem value="New">New</MenuItem>
                        <MenuItem value="Assigned">Assigned</MenuItem>
                        <MenuItem value="Fixed">Fixed</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                    <TextInput key={id} name="owner" value={issue.data.owner} label="Owner" onChange={handleChange} />
                    <NumberInput key={id} name="effort" value={issue.data.effort} label="Effort" onChange={handleChange} />
                    <DateInput key={id} name="due" value={issue.data.due} label="Due" onChange={handleChange} onValidityChange={handleValidityChange} />
                    <TextInput key={id} name="title" value={issue.data.title} label="Title" onChange={handleChange} />
                    <TextInput key={id} tag="textarea" name="description" value={issue.data.description} label="Description" onChange={handleChange} />
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </form>
            )}
            <Snackbar open={openAlert} autoHideDuration={6000} message="Issue updated" onClose={() => setOpenAlert(false)} />
        </div>
    );
}
