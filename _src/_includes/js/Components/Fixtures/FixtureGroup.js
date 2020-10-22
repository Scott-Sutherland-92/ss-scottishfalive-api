import React, { Component } from "react";

import FixtureRow from "./FixtureRow";

export default class FixtureGroup extends Component {
	render() {
		let matches = this.props.data[1];
		let matchDate = this.props.data[0];
		let type = this.props.comptype;

		const rows = matches.map((row) => {
			return (
				<React.Fragment key={row.matchid}>
					<FixtureRow data={row} comptype={type} />
				</React.Fragment>
			);
		});

		return (
			<div>
				<ul>
					<li>{matchDate}</li>
					{rows}
				</ul>
			</div>
		);
	}
}
