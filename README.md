# Issue Tracker

An issue tracking app built on MERN stack via Subramanian's ["Pro MERN Stack"](https://www.apress.com/in/book/9781484243909).

## Built With

* Node and Express
* MongoDB and [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* GraphQL
* React
* Material UI
* Webpack

## About

An app to track issues on an app, built for learning purposes. I previously started to learn React and wanted to enhance my understanding of it while learning other modern frameworks. I used Subramanian's ["Pro MERN Stack"](https://www.apress.com/in/book/9781484243909) as a primary reference, but also consulted other sources to make the modifications I desired. Essential sources include [React Hooks documentation](https://reactjs.org/docs/hooks-intro.html), [React Router documentation](https://reactrouter.com/web/guides/quick-start), [Material UI documentation](https://material-ui.com/getting-started/usage/), [MongoDB documentation](https://docs.mongodb.com/), and, of course, Stack Overflow.

## Modifications and Considerations

When building this app I chose to make several architectural changes. I've documented the major modifications below.

### Use of React Hooks instead of classes

Subramanian's code utilizes [React component classes](https://reactjs.org/docs/react-component.html). When building my own app, I refactored all classes into more functional [React Hooks](https://reactjs.org/docs/hooks-intro.html). I think the final result is more elegant and concise.

In order to refactor the classes, I found I had to use these hooks:

* `useState` and `useReducer` manage state previously handled by `this.state`. Reducer was especially useful for complex state management, such as the [IssueEdit](ui/src/IssueEdit.jsx) component that must fetch data, load data into form, track changes on form, and submit changes to API.
* `useEffect` manages functions that need to opt into the component lifecycle. This was necessary where Subramanian used the class methods `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. For the [IssueTable](ui/src/IssueTable.jsx) component, I found I needed to combine the side effect hook with a memoized callback (`useCallback`) to filter the table when the router parameters changed.
* `useRef` allowed accessing child components in a form imperatively, such as in the [IssueAdd](ui/src/IssueAdd.jsx) component where a form was referenced in order to access child input values.

### Use of Material UI instead of Bootstrap

Subramanian made the case for Bootstrap in his book:

> Material UI has an interesting CSS-in-JS and inline-style approach of styling that fits well into React’s philosophy of isolating everything needed by a component, with the component itself. But this framework is much less popular and seems to be a work in progress. And, perhaps the inline-style approach is too drastic a deviation from convention. React-Bootstrap is a safe alternative that is built on top of the very popular Bootstrap and fits our needs (except for the lack of a date picker).

Despite this argument, I went with Material UI because of curiosity and style preference. Having some experience with Bootstrap previously and keeping consistent with the goal of learning something new, I chose an alternate path. Compared to the rounded corners and pastels of Bootstrap, I've always found the sturdy, angular shapes and more vivid use of color to be more along my design taste. As I implement Material UI in this app, I want to test how easy it is to implement styled components into my React components, and how easy it is to implement my own custom styles to prevent the app design from looking bland and uniform.

## Authors

* **Matt Berti** (me)
* **[Vasan Subramanian](https://github.com/vasansr)** - Author of the book tutorial in which this app is based.
