import React, { Component } from "react";

import { Consumer } from "../Context";
import FixtureGroup from "./FixtureGroup";
import FixtureRow from "./FixtureRow";

let _ = require("lodash");

export default class Fixtures extends Component {
	render() {
		return (
			<Consumer>
				{(context) => {
					let matches = this.props.data.DATA;
					let type = context.type;
					let dataType = context.tab;

					matches = dataType == "results" ? _.reverse(matches) : matches;
					let fixtures =
						type == "League"
							? _.groupBy(matches, "matchdate")
							: _.groupBy(matches, "roundname");

					const groups = Object.entries(fixtures).map((row, index) => {
						return (
							<React.Fragment key={index}>
								<FixtureGroup fixtures={row} index={index} />
							</React.Fragment>
						);
					});

					let content = matches.length ? (
						groups
					) : (
						<div>
							<p>No Data</p>
						</div>
					);

					return <React.Fragment>{content}</React.Fragment>;
				}}
			</Consumer>
		);
	}
}
