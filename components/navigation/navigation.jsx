import React from 'react';

export default class Navigation extends React.Component {
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
		return <div className="component-navigation">
			<a href="/">Explore Projects</a>
			<a href="/about">About</a>
			<a href="//github.com/cphoover/project-explorer">Fork this project!</a>
		</div>;
	}
}
