import React from 'react';
import graphQlFetch from './graphql-fetch.js';

async function loadData(id) {
    const query = `query issue($id: Int!) {
        issue (id: $id) {
            id description
        }
    }`;

    const data = await graphQlFetch(query, { id });

    return data;
}

/**
 * Route component
 * Display detailed info about an issue, namely description.
 * @param {*} params Route params: history, location, match
 */
export default function IssueDetail(params) {
    console.log('<IssueDetail>', params);

    const id = Number(params.match.params.id);

    const [description, setDescription] = React.useState('');

    React.useEffect(() => {
        loadData(id).then((results) => {
            setDescription(results.issue.description || '[no description]');
        });
    }, [id]);

    return (
        <div>
            <h3>Description</h3>
            <pre>{description}</pre>
        </div>
    );
}
