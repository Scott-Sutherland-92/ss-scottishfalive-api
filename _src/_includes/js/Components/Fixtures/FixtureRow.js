import React, { Component } from "react";
import { Consumer } from "../Context";

export default class FixtureRow extends Component {
	getKickOff(string) {
		let date = new Date(string);
		let kickoff;

		// kickoff = date.getHours() + ":" + date.getMinutes();
		kickoff = date.toLocaleTimeString();
		kickoff = kickoff.substring(0, 5);

		return kickoff;
	}

	getMatchScores(match) {
		let homeScore = match.ftscorehome;
		let awayScore = match.ftscoreaway;

		// Check Extra Time Scores
		homeScore = match.aetscorehome ? match.aetscorehome : homeScore;
		awayScore = match.aetscoreaway ? match.aetscoreaway : awayScore;

		// Check Amended Scores
		homeScore =
			String(match.awardscorehome) != ""
				? String(match.awardscorehome)
				: homeScore;
		awayScore =
			String(match.awardscoreaway) != ""
				? String(match.awardscoreaway)
				: awayScore;

		let scores = {
			home: homeScore,
			away: awayScore,
			homePK: match.pkscorehome,
			awayPK: match.pkscoreaway,
		};

		return scores;
	}

	getMatchDetails(match) {
		let extraTime = match.aetscorehome || match.aetscoreaway ? true : false;
		let penalties = match.pkscorehome || match.pkscoreaway ? true : false;
		let amended =
			match.awardscorehome || match.awardscoreaway ? true : false;

		let hasMessage = extraTime || penalties || amended ? true : false;

		let pkWinners = match.pkscorehome > match.pkscoreaway ? match.homename : match.awayname;

		let extraTimeMessage = extraTime ? (
			<p className="info__extraTime">AET</p>
		) : null;
		let penaltiesMessage = penalties ? (
			<p className="info__penalties">
				{pkWinners} win {String(match.pkscorehome)}-
				{String(match.pkscoreaway)} on Penalties
			</p>
		) : null;
		let amendedMessage = amended ? (
			<p className="info__cancel">Score Amended by SWF</p>
		) : null;

		return {
			hasMessage: hasMessage,
			extraTime: extraTimeMessage,
			pk: penaltiesMessage,
			amended: amendedMessage,
		};
	}

	render() {
		return (
			<Consumer>
				{(context) => {
					let match = this.props.match;
					let matchType = context.tab;

					// Match Information
					let matchInfo = this.getMatchDetails(match);
					let matchDate = match.matchdate.replace(" 00:00:00", "");
					let kickoff = this.getKickOff(match.kickoff);
					let matchID = match.matchid;

					let matchDetails = this.getMatchDetails(match);
					let scores = this.getMatchScores(match);

					return (
						<li
							className={`sfaComp__fixture ${matchType}`}
							data-matchid={matchID}
						>
							<div className="fixture__details">
								<div className="fixture__details-game">
									<div className="fixture__details-game-item fixture__details-venue">
										<span className="material-icons">
											location_on
										</span>
										<div>{match.venue}</div>
									</div>
									<div className="fixture__details-game-item fixture__details--kickoff">
										<span className="material-icons">
											event
										</span>
										<div>{matchDate}</div>
									</div>
									<div className="fixture__details-game-item fixture__details--kickoff">
										<span className="material-icons">
											timer
										</span>
										<div>Kick Off: {kickoff}</div>
									</div>
								</div>
							</div>
							<div className="fixture__match-up">
								<div className="match-up__content">
									<div className="match-up__home">
										<div className="match-up__team-name">
											{match.homename}
										</div>
									</div>
									{matchType == "results" ? (
										<div className="match-up__score">
											{scores.home}
											<span>-</span>
											{scores.away}
										</div>
									) : (
										<div className="match-up__vs">vs</div>
									)}
									<div className="match-up__away">
										<div className="match-up__team-name">
											{match.awayname}
										</div>
									</div>
								</div>
								{matchDetails.hasMessage ? (
									<div className="fixture__info">
										<div className="info__content">
											{matchDetails.pk}
											{matchDetails.extraTime}
											{matchDetails.amended}
										</div>
									</div>
								) : null}
							</div>
						</li>
					);
				}}
			</Consumer>
		);
	}
}
