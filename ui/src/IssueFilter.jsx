import React from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { withRouter } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import { makeStyles, Slider, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
        maxWidth: 500,
    },
    form: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    numberInput: {
        width: 50,
    },
}));

/**
 * Navigation and functions for filtering IssueTable.
 * Component not a <Route> so need to pass through withRouter function to get
 * access to props.history.
 *
 * @param {Object} props Props supplied by React Router via withRouter method
 */
const IssueFilter = withRouter((props) => {
    console.log('<IssueFilter />', props);

    const classes = useStyles();
    // Read location qs to determine selectform value
    const { history, urlBase, location: { search } } = props;
    const queryParams = new URLSearchParams(search);

    const initialState = {
        status: queryParams.get('status') || '',
        effortMin: queryParams.get('effortMin') || '',
        effortMax: queryParams.get('effortMax') || '',
    };
    const [state, setState] = React.useState(initialState);

    React.useEffect(() => {
        // Change URL and apply filter based on state:status

        const newQuery = new URLSearchParams();
        if (state.status) newQuery.set('status', state.status);
        if (state.effortMin) newQuery.set('effortMin', state.effortMin);
        if (state.effortMax) newQuery.set('effortMax', state.effortMax);

        history.push({
            pathname: urlBase,
            search: newQuery.toString(),
        });
    }, [state]);

    // On form change, update state
    function handleChange(element) {
        const { name, value } = element.target;

        setState({
            ...state,
            [name]: value,
        });
    }

    // Collapse form
    const [open, setOpen] = React.useState(false);

    // Slider
    const initialValue = [state.effortMin, state.effortMax];
    const [value, setValue] = React.useState(initialValue);
    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        setState({
            ...state,
            effortMin: newValue[0],
            effortMax: newValue[1],
        });
    };

    function resetState() {
        setState({
            status: '',
            effortMin: '',
            effortMax: '',
        });
        setValue([0, 0]);
    }

    return (
        <div className={classes.root}>
            <Button
                startIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                onClick={() => setOpen(!open)}
            >
                Filter
            </Button>
            <Collapse in={open}>
                <Box className={classes.form}>
                    <Select name="status" value={state.status} displayEmpty onChange={handleChange}>
                        <MenuItem value="">Any Status</MenuItem>
                        <MenuItem value="New">New</MenuItem>
                        <MenuItem value="Assigned">Assigned</MenuItem>
                        <MenuItem value="Fixed">Fixed</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                    <div>
                        <Typography id="range-slider" gutterBottom>Effort</Typography>
                        <Slider value={value} onChangeCommitted={(handleSliderChange)} valueLabelDisplay="auto" aria-labelledby="range-slider" />
                    </div>
                    <Button variant="contained" onClick={resetState}>Clear Filters</Button>
                </Box>
            </Collapse>
        </div>
    );
});

export default IssueFilter;
