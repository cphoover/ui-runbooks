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
				<option value="most-run">Most Run</option>
				<option value="last-run">Last Run</option>
				<option value="least-run">Least Run</option>
			</select>;
	}

	componentDidMount() {
		this.domNode = ReactDOM.findDOMNode(this);
	}

}
