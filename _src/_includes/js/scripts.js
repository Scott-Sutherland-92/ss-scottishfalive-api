// Plugin Javascript
import React, { Component } from "react";
import ReactDOM from "react-dom";

import CompetitionRoot from "./Components";

const componentRoot = document.getElementById("competitionRoot");
if (componentRoot) {
	ReactDOM.render(<CompetitionRoot />, componentRoot);
}
