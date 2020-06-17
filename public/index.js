"use strict";

var continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];

function HelloWorld() {
  return continents.map(function (continent) {
    return /*#__PURE__*/React.createElement(Continent, null, continent);
  });
  return {
    helloContintents: helloContintents
  };
}

function Continent(props) {
  return /*#__PURE__*/React.createElement("a", {
    href: "/hello/{props.children}"
  }, "Hello ", props.children, "!");
}

var element = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "Hello World!"), /*#__PURE__*/React.createElement(HelloWorld, null));
ReactDOM.render(element, document.getElementById('root'));