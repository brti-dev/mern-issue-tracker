/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MenuIcon from '@material-ui/icons/Menu';
import ListIcon from '@material-ui/icons/List';
import ReportIcon from '@material-ui/icons/Assessment';
import AboutIcon from '@material-ui/icons/Info';
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

const tabs = [
    {
        label: 'Issues',
        to: '/issues',
        icon: <ListIcon />,
    },
    {
        label: 'Report',
        to: '/report',
        icon: <ReportIcon />,
    },
    {
        label: 'About',
        to: '/about',
        icon: <AboutIcon />,
    },
];

export default function Page() {
    const classes = useStyles();
    const location = useLocation();

    const currentLocationIndex = tabs.findIndex((tab) => tab.to === location.pathname);

    const [tabValue, setTabValue] = React.useState(currentLocationIndex);

    const handleChange = (event, newValue) => {
        console.log('setTabValue', newValue);
        setTabValue(newValue);
    };

    function NavBar() {
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
                        <Tabs value={tabValue} onChange={handleChange}>
                            {tabs.slice(0, 2).map((tab, index) => <Tab label={tab.label} to={tab.to} component={Link} key={index} />)}
                        </Tabs>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    function Footer() {
        return (
            <BottomNavigation
                value={tabValue}
                onChange={(event, newValue) => {
                    setTabValue(newValue);
                }}
                showLabels
                className={classes.root}
            >
                {tabs.map((tab, index) => <BottomNavigationAction {...tab} component={Link} key={index} />)}
            </BottomNavigation>
        );
    }

    return (
        <div>
            <NavBar />
            <Contents />
            <Footer />
        </div>
    );
}
