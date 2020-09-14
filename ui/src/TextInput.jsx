import React from 'react';
import TextField from '@material-ui/core/TextField';

function format(text) {
    return text != null ? text : '';
}

function unformat(text) {
    return text.trim().length === 0 ? null : text;
}

export default function TextInput(props) {
    const {
        tag = 'input',
        value,
        onChange,
        ...fieldProps
    } = props;

    const [textValue, setTextValue] = React.useState(format(value));

    const handleBlur = (event) => {
        onChange(event, unformat(textValue));
    };

    const handleChange = (event) => {
        setTextValue(event.target.value);
    };

    if (tag === 'input') {
        return (
            <TextField
                {...fieldProps}
                value={textValue}
                onBlur={handleBlur}
                onChange={handleChange}
            />
        );
    }

    if (tag === 'textarea') {
        return (
            <TextField
                {...fieldProps}
                value={textValue}
                onBlur={handleBlur}
                onChange={handleChange}
                multiline
                rows={4}
            />
        );
    }

    return React.createElement(tag, {
        ...fieldProps,
        value: textValue,
        onBlur: handleBlur,
        onChange: handleChange,
    });
}
