"use strict";

function IssueFilter() {
  return /*#__PURE__*/React.createElement("div", null, "foo");
}

function IssueTable() {
  return /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Title"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement(IssueRow, {
    issue_id: 1,
    issue_title: "Error foo"
  }), /*#__PURE__*/React.createElement(IssueRow, {
    issue_id: 2,
    issue_title: "Error bar"
  })));
}

function IssueAdd() {
  return /*#__PURE__*/React.createElement("div", null, "foo");
}

function IssueList() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "Issue Tracker"), /*#__PURE__*/React.createElement(IssueFilter, null), /*#__PURE__*/React.createElement(IssueTable, null), /*#__PURE__*/React.createElement(IssueAdd, null));
}

var element = /*#__PURE__*/React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById('root'));