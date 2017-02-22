import React from 'react';

export default class Masthead extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	handleChange(event) {
		this.setState({
			message: event.target.value
		});
	}
	render() {
		return <div className="component-masthead">
			<h1><span className="organization">{this.props.organization}</span>{this.props.title}</h1>
		</div>;
	}
}
