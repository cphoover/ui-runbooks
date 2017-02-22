import React from 'react';
import ReactDOM from 'react-dom';

export default class Sorter extends React.Component {
	constructor(props) {
		super(props);
	}

	change(event) {
		event.preventDefault();
		return this.props.onChange(this.domNode.value);
	}

	// @todo this should come from shared location
	render() {
		return <select className="component-sorter" onChange={this.change.bind(this)}>
				<option value="latest-commit-desc">Latest Commit (Most Recent)</option>
				<option value="latest-commit-asc">Latest Commit (Most Recent)</option>
				<option value="stars-desc">Most Stars</option>
				<option value="stars-asc">Least Stars</option>
				<option value="forks-desc">Most Forks</option>
				<option value="forks-asc">Least Forks</option>
			</select>;
	}

	componentDidMount() {
		this.domNode = ReactDOM.findDOMNode(this);
	}

}
