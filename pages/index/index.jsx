import React from 'react';
import querystring from 'querystring';
import Navigation from '../../components/navigation/navigation.jsx';
import Masthead from '../../components/masthead/masthead.jsx';
import Runbook from '../../components/runbook/runbook.jsx';
import SearchBar from '../../components/search_bar/search_bar.jsx';
import _ from 'lodash';
import updateHash from '../../util/update_hash';
import mockResponse from '../../mock-response.json'

require('whatwg-fetch');

const PER_PAGE = 20;

export default class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			runbooks : []
		};
	}
	handleChange(event) {
		this.setState({
			message: event.target.value
		});
	}

	formatDate(date) {
		return moment.utc(date).fromNow();
	}

	// @TODO put in separate component so we don't have to rerender the nav each time
	render() {
		return <div id="page-home">
				<Navigation/>
				<Masthead organization="Under Armour" title="B2B Runbook"/>
				<SearchBar />
				{ 
					this.state.runbooks.length ?
					this.state.runbooks.map(runbook => {
						return <Runbook
							name={runbook.name}
							description={runbook.description}
							schema={runbook.schema}
							key={runbook.id}
						/>
					}) : <h2 className='no-results'>No Runbooks Found</h2>
				 }
		</div>;
	}

	getRunbooks() {
		const keys = Object
			.keys(mockResponse);
		const runbooks = Object
			.values(mockResponse)
			.map((runbook, index) => Object.assign(runbook, {id : keys[index]}));
		const stateUpdates = {
			runbooks
		};
		this.setState(Object.assign({}, this.state, stateUpdates));
	}

	componentDidMount() {
		this.getRunbooks();
	}
}
