import axios from "axios";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import LeagueCompetition from "./LeagueCompetition";

class CompetitionRoot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			season: "",
			comp: "",
			data: [],
			type: "League",
		};
	}

	componentDidMount() {
		const season = document
			.getElementById("leagueCompetitionRoot")
			.getAttribute("data-season");

		const comp = document
			.getElementById("leagueCompetitionRoot")
			.getAttribute("data-comp");

		this.setState({
			season: season,
			comp: comp,
		});

		this.fetchData(comp, season);
	}

	fetchData(compID, season) {
		let endpointURL =
			"/wp-json/sfalive/v1/compdata/" +
			compID +
			"/" +
			season;
		axios
			.get(endpointURL)
			.then((response) => {
				this.setState({
					data: response.data,
					type: response.data.info.DATA.competitiontype,
					isLoading: false,
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	render() {
		let content;
		switch (this.state.type) {
			case "Cup":
				content = <h1>Cup Competition</h1>;
				break;
			default:
				content = <LeagueCompetition data={this.state.data} />;
		}

		let renderObj;
		renderObj = this.state.isLoading ? (
			<div className="ssfaComp__loadingBlock">LOADING</div>
		) : (
			<React.Fragment>{content}</React.Fragment>
		);

		return <div id="sfaComp__container">{renderObj}</div>;
	}
}

const componentRoot = document.getElementById("leagueCompetitionRoot");
if (componentRoot) {
	ReactDOM.render(<CompetitionRoot />, componentRoot);
}
