import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import graphQlFetch from './graphql-fetch.js';

export default function IssueAdd(props) {
    console.log('<IssueAdd>', props);

    const history = useHistory();
    const formRef = React.useRef();
    const [openError, setOpenError] = React.useState({ show: false, message: 'I am error.' });

    const showError = (message) => {
        setOpenError({ show: true, message });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = formRef.current;
        const issue = {
            owner: form.owner.value,
            title: form.title.value,
            due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
        };

        console.log('Create issue', issue);

        const query = `mutation issueAdd($issue: IssueInputs!) {
            issueAdd(issue: $issue) {
                id
            }
        }`;

        const result = await graphQlFetch(query, { issue }, showError);
        console.log('mutation issueAdd response', result);

        if (result) {
            history.push(`/edit/${result.issueAdd.id}`);
        }
    };

    return (
        <>
            <form ref={formRef} onSubmit={handleSubmit}>
                <TextField name="owner" label="Owner" variant="outlined" required fullWidth margin="normal" />
                <TextField name="title" label="Title" variant="outlined" required fullWidth margin="normal" />
                <Button type="submit" variant="contained" color="primary" fullWidth margin="normal">Add</Button>
            </form>
            <Snackbar
                open={openError.show}
                autoHideDuration={6000}
                onClose={() => setOpenError({ show: false })}
                message={openError.message}
            />
        </>
    );
}
