import React, { Component } from "react";
import request from "superagent";
import { styles } from "./styles";

class ReactSurvey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentQuestion: null,
      remainingQuestions: [...props.data.questions],
      ended: false,
      displayWelcomeMessage: true,
      displayGoodbyeMessage: false,
      globalLoading: false,
      globalError: false,
      folded: false,
      answers: [],
      hidden: true,
    };

    this.answerQuestion = this.answerQuestion.bind(this);
    this.endSurvey = this.endSurvey.bind(this);
    this.foldSurvey = this.foldSurvey.bind(this);
    this.unfoldSurvey = this.unfoldSurvey.bind(this);
  }

  componentWillMount() {
    const surveyDone = JSON.parse(localStorage.getItem("surveyDone"));
    const surveyState = JSON.parse(localStorage.getItem("surveyState"));
    console.log(surveyState);

    if (!surveyDone) {
      if (surveyState && surveyState.answers.length) {
        this.setState(surveyState);
      } else {
        this.setCurrentQuestion();
        setTimeout(() => {
          this.setState({
            hidden: false,
          });
        }, this.props.data.timeBeforePopUp * 1000);
      }
    }
  }

  foldSurvey() {
    this.setState({
      folded: true,
    });
  }

  unfoldSurvey() {
    this.setState({
      folded: false,
    });
  }

  setCurrentQuestion() {
    let remainingQuestions = this.state.remainingQuestions;
    let currentQuestion;
    if (this.props.data.random) {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      currentQuestion = remainingQuestions[randomIndex];
      remainingQuestions = remainingQuestions.filter(
        (q, i) => i !== randomIndex
      );
    } else {
      currentQuestion = remainingQuestions.shift();
    }

    this.setState({
      currentQuestion,
      remainingQuestions,
    });
  }

  answerQuestion(answer) {
    let ended = !this.state.remainingQuestions.length;
    this.setState({
      answers: [...this.state.answers, answer],
      ended,
      displayWelcomeMessage: false,
    });
    if (!ended) {
      this.setCurrentQuestion();
    }
  }

  endSurvey({ email, comment }) {
    const survey = {
      email,
      comment,
      answers: this.state.answers,
    };
    this.setState({
      globalLoading: true,
    });

    request
      .post(this.props.data.postUrl)
      .send({
        survey,
        authenticity_token: this.props.data.csrfToken,
      })
      .end((err, res) => {
        if (err) {
          console.warn(err);
          this.setState({
            globalLoading: false,
            globalErrorMessage: err.message,
          });
        } else {
          console.log(res.body);
          this.setState({
            displayGoodbyeMessage: true,
            globalLoading: false,
          });
        }
      });
  }

  closeSurvey() {
    document.getElementById("rs-parent").style = styles.hiddenStyle;
    localStorage.setItem("surveyDone", "true");
  }

  render() {
    console.log(this.state);

    localStorage.setItem("surveyState", JSON.stringify(this.state));

    if (this.state.globalErrorMessage) {
      return (
        <div style={styles.boxStyle}>
          {this.state.globalErrorMessage}
        </div>
      );
    }

    const boxPlusFoldStyle = { ...styles.boxStyle, ...styles.foldedStyle };
    return (
      <div id="rs-parent">
        <div style={this.state.folded ? boxPlusFoldStyle : styles.boxStyle}>
          <div className="heading">
            <DisplayButtons
              foldSurvey={this.foldSurvey}
              unfoldSurvey={this.unfoldSurvey}
              folded={this.state.folded}
            />
            <p className="title">
              {this.props.data.name}
            </p>
            <p>
              {this.state.displayWelcomeMessage
                ? this.props.data.messages.welcomeMessage
                : ""}
            </p>
          </div>
          {this.state.globalLoading
            ? <p>Loading</p>
            : this.state.displayGoodbyeMessage
              ? <div>
                  <p>
                    {this.props.data.messages.endingMessage}
                  </p>
                  <button onClick={this.closeSurvey}>
                    {this.props.data.messages.closeMessage}
                  </button>
                </div>
              : this.state.ended
                ? <End
                    data={this.props.data.ending}
                    onSubmit={this.endSurvey}
                    messages={this.props.data.messages}
                  />
                : <Question
                    data={this.state.currentQuestion || {}}
                    onSubmit={this.answerQuestion}
                    messages={this.props.data.messages}
                  />}
        </div>
      </div>
    );
  }
}

const End = props => {
  const { text, email, freeSpeech } = props.data;
  let comment, userEmail;
  return (
    <div>
      <p>
        {text}
      </p>
      <form
        onSubmit={e => {
          e.preventDefault();
          props.onSubmit({
            email: userEmail,
            comment,
          });
        }}
      >
        {freeSpeech
          ? <textarea onClick={e => (comment = e.target.value)} />
          : ""}
        {email
          ? <input
              onClick={e => (userEmail = e.target.value)}
              placeholder="email"
            />
          : ""}
        <button type="submit">
          {props.messages.endMessage}
        </button>
      </form>
    </div>
  );
};

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };
  }

  render() {
    const { text, choices, multiple, id, required } = this.props.data;
    let answers = [];
    return (
      <div className="question">
        <p>
          {text}
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!answers.length && required) {
              this.setState({
                error: true,
              });
              return;
            }
            this.setState({
              error: false,
            });
            document.querySelectorAll(".choice").forEach(node => {
              node.checked = false;
            });
            this.props.onSubmit({
              answers,
              id,
            });
          }}
        >
          {choices
            ? choices.map((c, i) =>
                <div key={i}>
                  <input
                    className="choice"
                    name={`question-${id}`}
                    type={multiple ? "checkbox" : "radio"}
                    value={c.toLowerCase()}
                    onClick={e => {
                      const answer = e.target.value;
                      if (answers.includes(answer)) {
                        answers.filter(a => a !== e.target.value);
                      } else {
                        answers.push(answer);
                      }
                    }}
                  />
                  <span>
                    {c}
                  </span>
                </div>
              )
            : []}
          <button type="submit">
            {this.props.messages.nextMessage}
          </button>
          {this.state.error
            ? <p>
                {this.props.messages.errorMessage}
              </p>
            : ""}
        </form>
      </div>
    );
  }
}

const DisplayButtons = props => {
  return (
    <div style={styles.displayButtonsStyle}>
      {props.folded
        ? <button onClick={props.unfoldSurvey}>+</button>
        : <button onClick={props.foldSurvey}>-</button>}
    </div>
  );
};

export default ReactSurvey;
