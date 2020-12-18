import React, { Component } from "react";
import { Consumer } from "../Context";

const CenterContent = ({ matchType, matchStatus, scores, kickoff }) => {
	if (matchStatus.status) {
		return (
			<div className="match-up__status">
				<span className="status__type">{matchStatus.content}</span>
				{matchStatus.reason ? <span className="status__reason">{matchStatus.reason}</span> : null}
			</div>
		);
	} else {
		if (matchType == "results") {
			return (
				<div className="match-up__score">
					{scores.home}
					<span>-</span>
					{scores.away}
				</div>
			);
		} else {
			return <div className="match-up__vs">{kickoff}</div>;
		}
	}
};

export default class FixtureRow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			details: false,
		};
		this.toggleDetailState = this.toggleDetailState.bind(this);
	}

	toggleDetailState() {
		this.setState((prevState) => ({
			details: !prevState.details,
		}));
	}

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

		let pkWinners =
			match.pkscorehome > match.pkscoreaway
				? match.homename
				: match.awayname;

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

	getMatchStatus(match) {
		let status = match.postponed ? true : false;
		let statusType = "";
		let statusReason = null;

		if (match.postponed) {
			statusType = "Postponed";
		}

		if (match.cancelled) {
			statusType = "Cancelled";
		}

		if (match.abandoned) {
			statusType = "Match Abandoned";
		}

		if (match.cancelreason) {
			statusReason = match.cancelreason;
		}

		return {
			status: status,
			content: statusType,
			reason: statusReason
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
					let matchStatus = this.getMatchStatus(match);

					let infoState = this.state.details
						? "fixture__activeDetails"
						: null;

					return (
						<li
							className={`sfaComp__fixture ${matchType} ${infoState}`}
							data-matchid={matchID}
							onClick={this.toggleDetailState}
						>
							<div className="fixture__match-up">
								<div className="match-up__content">
									<div className="match-up__home">
										<div className="match-up__team-name">
											{match.homename}
										</div>
									</div>
									{
										<CenterContent
											matchType={matchType}
											matchStatus={matchStatus}
											scores={scores}
											kickoff={kickoff}
										/>
									}
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
							<div className={`fixture__details`}>
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
						</li>
					);
				}}
			</Consumer>
		);
	}
}
