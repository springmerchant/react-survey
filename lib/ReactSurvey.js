"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _styles = require("./styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactSurvey = function (_Component) {
  _inherits(ReactSurvey, _Component);

  function ReactSurvey(props) {
    _classCallCheck(this, ReactSurvey);

    var _this = _possibleConstructorReturn(this, (ReactSurvey.__proto__ || Object.getPrototypeOf(ReactSurvey)).call(this, props));

    _this.state = {
      currentQuestion: null,
      remainingQuestions: [].concat(_toConsumableArray(props.data.questions)),
      ended: false,
      displayWelcomeMessage: true,
      displayGoodbyeMessage: false,
      globalLoading: false,
      globalError: false,
      folded: false,
      answers: [],
      hidden: true
    };

    _this.answerQuestion = _this.answerQuestion.bind(_this);
    _this.endSurvey = _this.endSurvey.bind(_this);
    _this.foldSurvey = _this.foldSurvey.bind(_this);
    _this.unfoldSurvey = _this.unfoldSurvey.bind(_this);
    return _this;
  }

  _createClass(ReactSurvey, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      var surveyDone = JSON.parse(localStorage.getItem("surveyDone"));
      var surveyState = JSON.parse(localStorage.getItem("surveyState"));
      console.log(surveyState);

      if (!surveyDone) {
        if (surveyState && surveyState.answers.length) {
          this.setState(surveyState);
        } else {
          this.setCurrentQuestion();
          setTimeout(function () {
            _this2.setState({
              hidden: false
            });
          }, this.props.data.timeBeforePopUp * 1000);
        }
      }
    }
  }, {
    key: "foldSurvey",
    value: function foldSurvey() {
      this.setState({
        folded: true
      });
    }
  }, {
    key: "unfoldSurvey",
    value: function unfoldSurvey() {
      this.setState({
        folded: false
      });
    }
  }, {
    key: "setCurrentQuestion",
    value: function setCurrentQuestion() {
      var remainingQuestions = this.state.remainingQuestions;
      var currentQuestion = void 0;
      if (this.props.data.random) {
        var randomIndex = Math.floor(Math.random() * remainingQuestions.length);
        currentQuestion = remainingQuestions[randomIndex];
        remainingQuestions = remainingQuestions.filter(function (q, i) {
          return i !== randomIndex;
        });
      } else {
        currentQuestion = remainingQuestions.shift();
      }

      this.setState({
        currentQuestion: currentQuestion,
        remainingQuestions: remainingQuestions
      });
    }
  }, {
    key: "answerQuestion",
    value: function answerQuestion(answer) {
      var ended = !this.state.remainingQuestions.length;
      this.setState({
        answers: [].concat(_toConsumableArray(this.state.answers), [answer]),
        ended: ended,
        displayWelcomeMessage: false
      });
      if (!ended) {
        this.setCurrentQuestion();
      }
    }
  }, {
    key: "endSurvey",
    value: function endSurvey(_ref) {
      var _this3 = this;

      var email = _ref.email,
          comment = _ref.comment;

      var survey = {
        email: email,
        comment: comment,
        answers: this.state.answers
      };
      this.setState({
        globalLoading: true
      });

      _superagent2.default.post(this.props.data.postUrl).send({
        survey: survey,
        authenticity_token: this.props.data.csrfToken
      }).end(function (err, res) {
        if (err) {
          console.warn(err);
          _this3.setState({
            globalLoading: false,
            globalErrorMessage: err.message
          });
        } else {
          console.log(res.body);
          _this3.setState({
            displayGoodbyeMessage: true,
            globalLoading: false
          });
        }
      });
    }
  }, {
    key: "closeSurvey",
    value: function closeSurvey() {
      document.getElementById("rs-parent").style = _styles.styles.hiddenStyle;
      localStorage.setItem("surveyDone", "true");
    }
  }, {
    key: "render",
    value: function render() {
      console.log(this.state);

      localStorage.setItem("surveyState", JSON.stringify(this.state));

      if (this.state.globalErrorMessage) {
        return _react2.default.createElement(
          "div",
          { style: _styles.styles.boxStyle },
          this.state.globalErrorMessage
        );
      }

      var boxPlusFoldStyle = _extends({}, _styles.styles.boxStyle, _styles.styles.foldedStyle);
      return _react2.default.createElement(
        "div",
        { id: "rs-parent" },
        _react2.default.createElement(
          "div",
          { style: this.state.folded ? boxPlusFoldStyle : _styles.styles.boxStyle },
          _react2.default.createElement(
            "div",
            { className: "heading" },
            _react2.default.createElement(DisplayButtons, {
              foldSurvey: this.foldSurvey,
              unfoldSurvey: this.unfoldSurvey,
              folded: this.state.folded
            }),
            _react2.default.createElement(
              "p",
              { className: "title" },
              this.props.data.name
            ),
            _react2.default.createElement(
              "p",
              null,
              this.state.displayWelcomeMessage ? this.props.data.messages.welcomeMessage : ""
            )
          ),
          this.state.globalLoading ? _react2.default.createElement(
            "p",
            null,
            "Loading"
          ) : this.state.displayGoodbyeMessage ? _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(
              "p",
              null,
              this.props.data.messages.endingMessage
            ),
            _react2.default.createElement(
              "button",
              { onClick: this.closeSurvey },
              this.props.data.messages.closeMessage
            )
          ) : this.state.ended ? _react2.default.createElement(End, {
            data: this.props.data.ending,
            onSubmit: this.endSurvey,
            messages: this.props.data.messages
          }) : _react2.default.createElement(Question, {
            data: this.state.currentQuestion || {},
            onSubmit: this.answerQuestion,
            messages: this.props.data.messages
          })
        )
      );
    }
  }]);

  return ReactSurvey;
}(_react.Component);

var End = function End(props) {
  var _props$data = props.data,
      text = _props$data.text,
      email = _props$data.email,
      freeSpeech = _props$data.freeSpeech;

  var comment = void 0,
      userEmail = void 0;
  return _react2.default.createElement(
    "div",
    null,
    _react2.default.createElement(
      "p",
      null,
      text
    ),
    _react2.default.createElement(
      "form",
      {
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          props.onSubmit({
            email: userEmail,
            comment: comment
          });
        }
      },
      freeSpeech ? _react2.default.createElement("textarea", { onClick: function onClick(e) {
          return comment = e.target.value;
        } }) : "",
      email ? _react2.default.createElement("input", {
        onClick: function onClick(e) {
          return userEmail = e.target.value;
        },
        placeholder: "email"
      }) : "",
      _react2.default.createElement(
        "button",
        { type: "submit" },
        props.messages.endMessage
      )
    )
  );
};

var Question = function (_Component2) {
  _inherits(Question, _Component2);

  function Question(props) {
    _classCallCheck(this, Question);

    var _this4 = _possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).call(this, props));

    _this4.state = {
      error: false
    };
    return _this4;
  }

  _createClass(Question, [{
    key: "render",
    value: function render() {
      var _this5 = this;

      var _props$data2 = this.props.data,
          text = _props$data2.text,
          choices = _props$data2.choices,
          multiple = _props$data2.multiple,
          id = _props$data2.id,
          required = _props$data2.required;

      var answers = [];
      return _react2.default.createElement(
        "div",
        { className: "question" },
        _react2.default.createElement(
          "p",
          null,
          text
        ),
        _react2.default.createElement(
          "form",
          {
            onSubmit: function onSubmit(e) {
              e.preventDefault();
              if (!answers.length && required) {
                _this5.setState({
                  error: true
                });
                return;
              }
              _this5.setState({
                error: false
              });
              document.querySelectorAll(".choice").forEach(function (node) {
                node.checked = false;
              });
              _this5.props.onSubmit({
                answers: answers,
                id: id
              });
            }
          },
          choices ? choices.map(function (c, i) {
            return _react2.default.createElement(
              "div",
              { key: i },
              _react2.default.createElement("input", {
                className: "choice",
                name: "question-" + id,
                type: multiple ? "checkbox" : "radio",
                value: c.toLowerCase(),
                onClick: function onClick(e) {
                  var answer = e.target.value;
                  if (answers.includes(answer)) {
                    answers.filter(function (a) {
                      return a !== e.target.value;
                    });
                  } else {
                    answers.push(answer);
                  }
                }
              }),
              _react2.default.createElement(
                "span",
                null,
                c
              )
            );
          }) : [],
          _react2.default.createElement(
            "button",
            { type: "submit" },
            this.props.messages.nextMessage
          ),
          this.state.error ? _react2.default.createElement(
            "p",
            null,
            this.props.messages.errorMessage
          ) : ""
        )
      );
    }
  }]);

  return Question;
}(_react.Component);

var DisplayButtons = function DisplayButtons(props) {
  return _react2.default.createElement(
    "div",
    { style: _styles.styles.displayButtonsStyle },
    props.folded ? _react2.default.createElement(
      "button",
      { onClick: props.unfoldSurvey },
      "+"
    ) : _react2.default.createElement(
      "button",
      { onClick: props.foldSurvey },
      "-"
    )
  );
};

exports.default = ReactSurvey;