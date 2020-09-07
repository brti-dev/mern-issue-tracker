import React from 'react';

function displayFormat(date) {
    return (date != null) ? date.toDateString() : '';
}

function editFormat(date) {
    return (date != null) ? date.toISOString().substr(0, 10) : '';
}

function unformat(string) {
    const value = new Date(string);

    return Number.isNaN(value.getTime()) ? null : value;
}

export default function DateInput({
    value,
    onChange,
    onValidityChange,
    ...fieldProps
}) {
    const initialState = {
        value: editFormat(value),
        isFocused: false,
        isValid: true,
    };
    const [state, setState] = React.useState(initialState);

    const handleFocus = (event) => {
        setState({ ...state, isFocused: true });
    };

    /**
     * Check for validity of input, then inform parent component of changed validity and value
     * @param {Event} event Event object
     */
    const handleBlur = (event) => {
        const dateValue = unformat(state.value);
        const isValid = state.value === '' || dateValue != null;

        if (onValidityChange) {
            onValidityChange(event, isValid);
        }

        if (isValid) {
            onChange(event, dateValue);
        }

        setState({ ...state, isValid, isFocused: false });
    };

    const handleChange = (event) => {
        if (event.target.value.match(/^[\d-]*$/)) {
            setState({ ...state, value: event.target.value });
        }
    };

    const className = (!state.isValid && !state.isFocused) ? 'invalid' : null;
    const displayValue = (state.isFocused || !state.isValid) ? state.value : displayFormat(value);
    const placeholder = state.isFocused ? 'yyyy-mm-dd' : null;

    return (
        <input
            {...fieldProps}
            type="text"
            placeholder={placeholder}
            value={displayValue}
            className={className}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
        />
    );
}
