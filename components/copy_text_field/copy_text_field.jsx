import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class CopyTextField extends React.Component {
	constructor(props) {
		super(props);
	}

	copyValue() {
		const copyTextarea = ReactDOM
			.findDOMNode(this)
			.querySelector('input');

		copyTextarea.select();

		try {
			const successful = document.execCommand('copy');
			global.alert('Text Succesfully copied to your clipboard! ');
		} catch (err) {
			console.log('Oops, unable to copy');
		}
	}

	render() {
		return <div className="component-copy-text-field">
					<label htmlFor={this.props.fieldId} onClick={this.copyValue.bind(this)}>
						<i className="material-icons">content_copy</i>
					</label>
					<input id={this.props.fieldId} type="text" value={this.props.value} readOnly="true" />
				</div>;
	}

}
