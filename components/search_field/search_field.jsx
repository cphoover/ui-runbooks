import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchField extends React.Component {
	constructor(props) {
		super(props);
	}

	submit(event) {
		event.preventDefault();
		return this.props.onSubmit(this.inputField.value);
	}

	render() {
		return <div className="component-search-field">
			<div className="input-wrapper">
				<form onSubmit={this.submit.bind(this)}>
					<input type="text" id="search" placeholder="Search..." />
					<button className="icon"><i className="material-icons">search</i></button>
				</form>
			</div>
		</div>;
	}

	componentDidMount() {
		this.inputField = ReactDOM.findDOMNode(this).querySelector('input#search');
	}

}
