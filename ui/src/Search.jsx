/* eslint-disable react/jsx-indent-props */
import React from 'react';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import SearchIcon from '@material-ui/icons/Search';
import graphQlFetch from './graphql-fetch.js';

const customStyles = {
    option: (provided) => ({
        ...provided,
        color: 'black',
    }),
};

const loadOptions = async (inputValue) => {
    console.log('loadOptions', inputValue);
    if (inputValue.length < 3) {
        return [];
    }

    const query = `query issueList($search: String) {
        issueList(search: $search) {
            issues {id title}
        }
    }`;
    const result = await graphQlFetch(query, { search: inputValue });
    console.log('loadOptions result:', result);

    return result.issueList.issues.map((issue) => ({
        label: `#${issue.id}: ${issue.title}`,
        value: issue.id,
    }));
};

const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <SearchIcon primaryColor="pink" />
    </components.DropdownIndicator>
);

const Search = (props) => {
    const { history } = props;
    const handleChange = (result) => {
        console.log('handleChange', result);
        history.push(`/edit/${result.value}`);
    };

    return (
        <AsyncSelect
            instanceId="search-select"
            placeholder="Search Issues"
            loadOptions={loadOptions}
            onChange={handleChange}
            components={{ DropdownIndicator }}
            styles={customStyles}
        />
    );
};

export default withRouter(Search);
