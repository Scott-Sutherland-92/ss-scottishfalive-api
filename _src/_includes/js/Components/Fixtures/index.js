import React, { Component } from "react";

import { GroupBy } from "react-lodash";

import FixtureGroup from "./FixtureGroup";
import FixtureRow from "./FixtureRow";

let _ = require('lodash');

export default class Fixtures extends Component {
	render() {
		let matches = this.props.data.DATA;
		let type = this.props.comptype;

		let result = _.groupBy(matches, 'matchdate');
		const groups = Object.entries(result).map((row, index) => {
			return (
				<React.Fragment key={index}>
					<FixtureGroup data={row} comptype={type} />
				</React.Fragment>
			);
		});

		return (
			<div className="row">
				<div className="col-6">{groups}</div>
			</div>
		);
	}
}
