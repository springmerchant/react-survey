"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var lightBlue = "#6cdbdc";

var styles = {
  boxStyle: {
    width: "300px",
    minHeight: "300px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    border: "2px solid " + lightBlue,
    borderRadius: "5px",
    padding: "10px",
    backgroundColor: "#fff"
  },
  heading: {
    title: {
      textAlign: "center",
      fontWeight: "bold",
      color: lightBlue,
      fontSize: "1.4em",
      margin: "5px 0"
    },
    description: {
      textAlign: "justify",
      textJustify: "inter-word",
      padding: "0 20px"
    }
  },
  question: {
    text: {
      fontWeight: "bold"
    }
  },
  displayButtonsStyle: {
    marginBottom: "2px"
  },
  foldedStyle: {
    minHeight: "20px",
    height: "20px",
    overflow: "hidden"
  },
  hiddenStyle: {
    display: "none"
  }
};

exports.styles = styles;