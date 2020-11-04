import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import { Provider } from "./Context";
import Competition from "./Competition";

class CompetitionRoot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			season: "",
			comp: "",
			data: [],
			tab: "fixtures",
			type: "League",
		};
	}

	componentDidMount() {
		const season = document
			.getElementById("competitionRoot")
			.getAttribute("data-season");

		const comp = document
			.getElementById("competitionRoot")
			.getAttribute("data-comp");

		this.fetchData(comp, season);
	}

	fetchData(compID, season) {
		let endpointURL =
			"/wp-json/sfalive/v1/compdata/" + compID + "?season=" + season;
		axios
			.get(endpointURL)
			.then((response) => {
				this.setState({
					comp: compID,
					data: response.data,
					type: response.data.info.DATA.competitiontype,
					season: season,
					isLoading: false,
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	handleTabChange = (e) => {
		let tab = e.target.getAttribute("data-tab");
		this.setState((state) => ({
			tab: tab,
		}));
	};

	render() {
		let renderObj;
		renderObj = this.state.isLoading ? (
			<div className="ssfaComp__loadingBlock">LOADING</div>
		) : (
			<Competition data={this.state.data} type={this.state.type} />
		);

		let contextObj = {
			comp: this.state.comp,
			data: this.state.data,
			type: this.state.type,
			season: this.state.season,
			tab: this.state.tab,
			isLoading: this.state.isLoading,
			tabFunction: this.handleTabChange,
		};

		return (
			<Provider value={contextObj}>
				<div id="sfaComp__container">{renderObj}</div>
			</Provider>
		);
	}
}

export default CompetitionRoot;
