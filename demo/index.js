import React from "react";
import ReactDOM from "react-dom";
import ReactSurvey from "../lib/index";
import { fakeSurvey } from "./data";

ReactDOM.render(
  <ReactSurvey data={fakeSurvey} />,
  document.getElementById("root")
);
