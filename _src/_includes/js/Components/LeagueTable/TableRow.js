import React from 'react';

const TableRow = (props) => {
	let row = props.data;
	return (
		<div className="sfaComp__table-row">
		    <span>{row.ranking}</span>
		    <span>{row.name}</span>
		    <span>{row.played}</span>
		    <span className="hiddenMobile">{row.won}</span>
		    <span className="hiddenMobile">{row.drawn}</span>
		    <span className="hiddenMobile">{row.lost}</span>
		    <span className="hiddenMobile">{row.goalsfor}</span>
		    <span className="hiddenMobile">{row.goalsagainst}</span>
		    <span>{row.goaldifference}</span>
		    <span>{row.points}</span>
		</div>
	);
}

export default TableRow;