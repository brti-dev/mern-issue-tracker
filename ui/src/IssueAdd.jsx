import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import graphQlFetch from './graphQlFetch.js';

export default function IssueAdd(props) {
    console.log('<IssueAdd>', props);

    const { onAdd } = props;

    const formRef = React.useRef();

    const handleSubmit = (e) => {
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

        graphQlFetch(query, { issue }).then((result) => {
            console.log('mutation issueAdd response', result);
            onAdd();
        });
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <TextField name="owner" label="Owner" variant="outlined" required fullWidth margin="normal" />
            <TextField name="title" label="Title" variant="outlined" required fullWidth margin="normal" />
            <Button type="submit" variant="contained" color="primary" fullWidth margin="normal">Add</Button>
        </form>
    );
}
