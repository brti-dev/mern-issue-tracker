"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) {
    return new Date(value);
  }

  return value;
}

function loadData() {
  var query = 'query { issueList { id title status, owner, created, effort, due } }';
  return new Promise(function (resolve, reject) {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    }).then(function (response) {
      return response.text();
    }).then(function (data) {
      var json = JSON.parse(data, jsonDateReviver);
      return resolve(json);
    });
  });
}

function IssueFilter() {
  return /*#__PURE__*/React.createElement("div", null, "foo");
}

function IssueTable() {
  var _React$useState = React.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      issues = _React$useState2[0],
      setIssues = _React$useState2[1];

  React.useEffect(function () {
    loadData().then(function (result) {
      console.log('loadData result:', result);
      setIssues(result.data.issueList);
    });
  }, []);
  var issueRows = issues.map(function (issue) {
    return /*#__PURE__*/React.createElement(IssueRow, {
      key: issue.id,
      issue: issue
    });
  });

  var createIssue = function createIssue(issue) {
    console.log('createIssue', issue);
    var query = "mutation {\n            issueAdd(issue:{\n                title: \"".concat(issue.title, "\",\n                owner: \"").concat(issue.owner, "\",\n                due: \"").concat(issue.due.toISOString(), "\",\n            }) {\n                id\n            }\n        }");
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log('mutation issueAdd response', data);
      loadData().then(function (result) {
        return setIssues(result.data.issueList);
      });
    });
  };

  var formRef = React.useRef();

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    var form = formRef.current;
    var issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
    };
    createIssue(issue);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("table", {
    border: "1"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Owner"), /*#__PURE__*/React.createElement("th", null, "Created"), /*#__PURE__*/React.createElement("th", null, "Effort"), /*#__PURE__*/React.createElement("th", null, "Due Date"), /*#__PURE__*/React.createElement("th", null, "Title"))), /*#__PURE__*/React.createElement("tbody", null, issueRows)), /*#__PURE__*/React.createElement("form", {
    ref: formRef,
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "owner",
    placeholder: "Owner"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "title",
    placeholder: "Title"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Add")));
}

function IssueRow(_ref) {
  var issue = _ref.issue;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, issue.id), /*#__PURE__*/React.createElement("td", null, issue.status), /*#__PURE__*/React.createElement("td", null, issue.owner), /*#__PURE__*/React.createElement("td", null, issue.created), /*#__PURE__*/React.createElement("td", null, issue.effort), /*#__PURE__*/React.createElement("td", null, issue.due && issue.due), /*#__PURE__*/React.createElement("td", null, issue.title));
}

function IssueList() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "Issue Tracker"), /*#__PURE__*/React.createElement(IssueFilter, null), /*#__PURE__*/React.createElement(IssueTable, null));
}

var element = /*#__PURE__*/React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById('root'));