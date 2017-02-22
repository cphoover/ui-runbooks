import React from 'react';
import CopyTextField from '../copy_text_field/copy_text_field.jsx';

export default class Repo extends React.Component {
	constructor(props) {
		super(props);
	}
	getCloseRate() {
		const closed = parseInt(this.props.closedIssues, 10);
		const opened = parseInt(this.props.openIssues, 10);
		return Math.floor(
			(closed / (opened + closed)) * 100
		);
	}
	render() {
		// @TODO closed issues not a part of listing... so you can add this data back in if they decide to add
		// or we do additional fetching of data for each repo
		// &nbsp;<span className="stat">Closed Issues: {this.props.closedIssues}</span> = <strong>{this.getCloseRate()}%</strong> Close Rate
		return <div className="component-repo">
					<h2>{this.props.name}</h2>
					<p>{this.props.description}</p>
					<p><span className="stat">Last pushed {this.props.lastPushed} </span></p>
					<p><span className="stat">Stars: {this.props.stars}</span>&nbsp;<span className="stat">Forks: {this.props.forks}</span></p>
					<p><span className="stat">Open Issues: {this.props.openIssues}</span></p>
					<CopyTextField label="url:" value={this.props.url} />
				</div>;
	}

}
