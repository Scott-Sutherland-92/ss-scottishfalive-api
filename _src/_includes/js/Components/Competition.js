import axios from "axios";
import React, { Component } from "react";

import { Consumer } from "./Context";
import LeagueTable from "./LeagueTable";
import Fixtures from "./Fixtures";

export default class Competition extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Consumer>
				{(context) => {
					let content;
					let activeClass;
					switch (context.tab) {
						case "table":
							activeClass = "active__table";
							content = (
								<LeagueTable data={context.data.table} />
							);
							break;
						case "results":
							activeClass = "active__results";
							content = (
								<Fixtures
									data={context.data.results}
									datatype="results"
									comptype={context.type}
								/>
							);
							break;
						default:
							activeClass = "active__fixtures";
							content = (
								<Fixtures
									data={context.data.fixtures}
									datatype="fixtures"
									comptype={context.type}
								/>
							);
					}

					let comptype;
					comptype =
						context.type == "League"
							? "sfaComp__leagueComp"
							: "sfaComp__cupComp";

					return (
						<div id={comptype}>
							<div
								className={`sfaComp__tabButtons ${activeClass}`}
							>
								<div className="sfaComp__title">
									<h1>{context.data.info.DATA.competitionname}</h1>
									<h6>{`Season ${context.season}`}</h6>
								</div>
								<ul>
									<li
										onClick={context.tabFunction}
										data-tab="fixtures"
									>
										Fixtures
									</li>
									<li
										onClick={context.tabFunction}
										data-tab="results"
									>
										Results
									</li>
									{this.props.type == "League" ? (
										<li
											onClick={context.tabFunction}
											data-tab="table"
										>
											League Table
										</li>
									) : null}
								</ul>
							</div>
							{content}
						</div>
					);
				}}
			</Consumer>
		);
	}
}
