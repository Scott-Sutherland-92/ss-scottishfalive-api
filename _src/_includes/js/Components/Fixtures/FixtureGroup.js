import React, { Component } from "react";

import FixtureRow from "./FixtureRow";

export default class FixtureGroup extends Component {
	handleDropdown(e) {
		e.preventDefault();
		e.target.parentNode.parentNode.classList.toggle("active__match_group");
	}
	render() {
		let matches = this.props.fixtures[1];
		let matchDate = this.props.fixtures[0];
		matchDate = matchDate.replace(" 00:00:00", "");

		let activeClass = (this.props.index < 3) ? "active__match_group" : null;

		const rows = matches.map((row) => {
			return (
				<React.Fragment key={row.matchid}>
					<FixtureRow match={row} />
				</React.Fragment>
			);
		});

		return (
			<div>
				<ul className={`sfaComp__match_group ${activeClass}`}>
					<li className="sfaComp__match_date">
						<a href="" onClick={this.handleDropdown}>
							{matchDate}
							<i className="material-icons">keyboard_arrow_down</i>
						</a>
					</li>
					{rows}
				</ul>
			</div>
		);
	}
}
