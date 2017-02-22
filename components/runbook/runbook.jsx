import React from 'react';
import Form from "react-jsonschema-form";

export default class Runbook extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return <div className="component-runbook">
					<h2>{this.props.name}</h2>
					<p>{this.props.description}</p>
					<Form schema={this.props.schema} />
				</div>;
	}

}
