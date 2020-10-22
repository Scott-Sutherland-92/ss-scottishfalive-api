import React, { Component } from "react";

export default class FixtureRow extends Component {
	render() {
		let match = this.props.data;
		return <li>{match.homename}</li>;
	}
}
