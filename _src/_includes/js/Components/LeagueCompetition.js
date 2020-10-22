import axios from "axios";
import React, { Component } from "react";

import LeagueTable from "./LeagueTable";
import Fixtures from "./Fixtures";

export default class LeagueCompetition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			season: "",
			tab: "fixtures",
		};
	}

	handleClick = (e) => {
		let tab = e.target.getAttribute("data-tab");
		this.setState((state) => ({
			tab: tab,
		}));
	};

	render() {
		let content;
		let activeClass;
		switch (this.state.tab) {
			case "table":
				activeClass = "active__table";
				content = <LeagueTable data={this.props.data.table} />;
				break;
			case "results":
				activeClass = "active__results";
				content = <div>RESULT DATA</div>;
				break;
			default:
				activeClass = "active__fixtures";
				content = <Fixtures data={this.props.data.fixtures} comptype="league" />;
		}

		return (
			<div id="sfaComp__leagueComp">
				<div className={`sfaComp__tabButtons ${activeClass}`}>
					<ul>
						<li onClick={this.handleClick} data-tab="fixtures">
							Fixtures
						</li>
						<li onClick={this.handleClick} data-tab="results">
							Results
						</li>
						<li onClick={this.handleClick} data-tab="table">
							League Table
						</li>
					</ul>
				</div>
				{content}
			</div>
		);
	}
}
