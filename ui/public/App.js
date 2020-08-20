"use strict";

var _graphQlFetch = _interopRequireDefault(require("./graphQlFetch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function IssueFilter() {
  return /*#__PURE__*/React.createElement("div", null, "foo");
}

function fetchIssues() {
  return _fetchIssues.apply(this, arguments);
}

function _fetchIssues() {
  _fetchIssues = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var query, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = 'query { issueList { id title status, owner, created, effort, due } }';
            _context.next = 3;
            return (0, _graphQlFetch.default)(query);

          case 3:
            data = _context.sent;

            if (!data) {
              _context.next = 7;
              break;
            }

            console.log('fetchIssues result:', data);
            return _context.abrupt("return", data.issueList);

          case 7:
            return _context.abrupt("return", {});

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _fetchIssues.apply(this, arguments);
}

function issuesReducer(state, action) {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return _objectSpread(_objectSpread({}, state), {}, {
        data: action.payload
      });

    case 'CREATE':
      break;

    default:
      throw new Error();
  }

  return {};
}

function IssueTable() {
  var _React$useReducer = React.useReducer(issuesReducer, {
    data: []
  }),
      _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
      issues = _React$useReducer2[0],
      dispatchIssues = _React$useReducer2[1];

  console.log('State: issues', issues);
  React.useEffect(function () {
    fetchIssues().then(function (result) {
      dispatchIssues({
        type: 'FETCH_SUCCESS',
        payload: result
      });
    });
  }, []);
  var issueRows = issues.data.map(function (issue) {
    return /*#__PURE__*/React.createElement(IssueRow, {
      key: issue.id,
      issue: issue
    });
  });
  var formRef = React.useRef();

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    var form = formRef.current;
    var issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
    };
    console.log('Create issue', issue);
    var query = "mutation issueAdd($issue: IssueInputs!) {\n            issueAdd(issue: $issue) {\n                id\n            }\n        }";
    (0, _graphQlFetch.default)(query, {
      issue: issue
    }).then(function (result) {
      console.log('mutation issueAdd response', result);
      fetchIssues().then(function (payload) {
        dispatchIssues({
          type: 'FETCH_SUCCESS',
          payload: payload
        });
      });
    });
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