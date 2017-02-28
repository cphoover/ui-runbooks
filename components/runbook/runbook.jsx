import React from 'react';
import Form from 'react-jsonschema-form';

export default class Runbook extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			closed : true
		}
	}
	toggle() {
		console.log('toggle');
		this.setState(Object.assign(this.state, {closed : !this.state.closed }));
	}
	render() {
		const log = (type) => console.log.bind(console, type);

		return <div className={`component-runbook ${this.state.closed ? 'closed' : ''}`}>
					<div className='toggle' onClick={() => this.toggle()}>
						<h2>{this.props.name}</h2>
						<p>{this.props.description}</p>
					</div>
					<Form schema={this.props.schema}
						onChange={log('changed')}
						onSubmit={log('submitted')}
						onError={log('errors')}
					/>
				</div>;
	}

}
