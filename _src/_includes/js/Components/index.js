import axios from "axios";
import React, { Component } from "react";
import ReactDOM from "react-dom";

class LeagueCompetition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			season: "",
			tab: "fixtures",
			data: [],
		};
	}

	componentDidMount() {
		console.log("Mounted Component");
		const season = document
			.getElementById("leagueCompetitionRoot")
			.getAttribute("data-season");

		const comp = document
			.getElementById("leagueCompetitionRoot")
			.getAttribute("data-comp");

		let endpointURL = "/wp-json/sfalive/v1/compdata/" + comp;
		axios
			.get(endpointURL)
			.then((response) => {
				this.setState({
					season: season,
					data: response.data,
					isLoading: false,
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	handleClick = (e) => {
		let tab = e.target.getAttribute("data-tab");
		this.setState((state) => ({
			tab: tab
		}));
	};

	render() {
		let content;
		let activeClass;
		switch (this.state.tab) {
			case "table":
				activeClass = "active__table";
				content = this.state.isLoading ? (
					<div>LOADING...</div>
				) : (
					<div>TABLE DATA</div>
				);
				break;
			case "results":
				activeClass = "active__results";
				content = this.state.isLoading ? (
					<div>LOADING...</div>
				) : (
					<div>RESULT DATA</div>
				);
				break;
			default:
				activeClass = "active__fixtures";
				content = this.state.isLoading ? (
					<div>LOADING...</div>
				) : (
					<div>FIXTURE DATA</div>
				);
		}

		return (
			<div id="sfaComp__container">
				<div className={`cf__tabButtons ${activeClass}`}>
					<ul>
						<li
							onClick={this.handleClick}
							data-tab="fixtures"
						>
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

const componentRoot = document.getElementById("leagueCompetitionRoot");
if (componentRoot) {
	ReactDOM.render(<LeagueCompetition />, componentRoot);
}
