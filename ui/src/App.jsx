import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
// Implement hash router: view components based on hash
import { BrowserRouter as Router } from 'react-router-dom';
// Material UI Baseline ("normalize")
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import Page from './Page.jsx';
import theme from './theme.js';

const element = (
    <>
        <CssBaseline />
        <ThemeProvider theme={theme}>
            <Router>
                <Page />
            </Router>
        </ThemeProvider>
    </>
);

ReactDOM.render(element, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
    module.hot.accept();
}
