import React from 'react';
import TextField from '@material-ui/core/TextField';

function format(number) {
    return number != null ? number.toString() : '';
}

function unformat(string) {
    const value = parseInt(string, 10);

    return Number.isNaN(value) ? null : value;
}

export default function NumberInput(props) {
    const { value, onChange } = props;

    const [state, setState] = React.useState({ value: format(value) });

    const handleBlur = (event) => {
        onChange(event, unformat(state.value));
    };

    const handleChange = (event) => {
        if (event.target.value.match(/^\d*$/)) {
            setState({ value: event.target.value });
        }
    };

    return (
        <TextField {...props} value={state.value} onBlur={handleBlur} onChange={handleChange} />
    );
}
