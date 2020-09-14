import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuIcon from '@material-ui/icons/Menu';
import Contents from './Contents.jsx';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    hamburger: {
        display: 'none',
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    chip: {
        marginLeft: theme.spacing(1),
    },
}));

function NavBar() {
    const classes = useStyles();

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        console.log('setValue', newValue);
        setValue(newValue);
    };

    // Only show the "MERN!" chip if the screen is bigger than small breakpoint
    const MernChip = () => {
        const theme = useTheme();
        if (useMediaQuery(theme.breakpoints.up('sm'))) {
            return <Chip label="MERN!" color="secondary" size="small" className={classes.chip} />;
        }

        return '';
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.hamburger} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Issue Tracker
                        <MernChip />
                    </Typography>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Issue List" component={Link} to="/issues" />
                        <Tab label="Report" component={Link} to="/report" />
                    </Tabs>
                    {/* <Typography>
                        <NavLink to="/issues">Issue List</NavLink>{' '}
                        <NavLink to="/report">Report</NavLink>
                    </Typography> */}
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default function Page() {
    return (
        <div>
            <NavBar />
            <Contents />
        </div>
    );
}
