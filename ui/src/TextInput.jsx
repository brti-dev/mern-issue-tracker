import React from 'react';

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

    return React.createElement(tag, {
        ...fieldProps,
        value: textValue,
        onBlur: handleBlur,
        onChange: handleChange,
    });
}
