import React, { Component } from "react";

import TableRow from "./TableRow";

export default class LeagueTable extends Component {
	render() {
		const data = this.props.data.DATA;
		const rows = data.map((row) => <TableRow key={row.clubid} data={row} />);
		return (
			<div>
				<div className="sfaComp_leagueTable">
					<div className="sfaComp__table-head">
						<div className="sfaComp__table-row">
							<span>Pos</span>
							<span>Team</span>
							<span>Pld</span>
							<span className="hiddenMobile">W</span>
							<span className="hiddenMobile">D</span>
							<span className="hiddenMobile">L</span>
							<span className="hiddenMobile">GF</span>
							<span className="hiddenMobile">GA</span>
							<span>GD</span>
							<span>Pts</span>
						</div>
					</div>
					<div className="sfaComp__table-body">{rows}</div>
				</div>
			</div>
		);
	}
}
