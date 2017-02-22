import React from 'react';
import querystring from 'querystring';
import Navigation from '../../components/navigation/navigation.jsx';
import Masthead from '../../components/masthead/masthead.jsx';
import Repo from '../../components/repo/repo.jsx';
import Pagination from '../../components/pagination/pagination.jsx';
import SearchBar from '../../components/search_bar/search_bar.jsx';
import moment from 'moment';
import _ from 'lodash';
import updateHash from '../../util/update_hash';

require('whatwg-fetch');

const PER_PAGE = 20;

export default class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			repos : [],
			page : 0
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
				<Masthead organization="Netflix" title="OSS Project Explorer"/>
				<SearchBar />
				{
					this.state.repos.length ?
					this.state.repos.map(repo => {
						return <Repo
							name={repo.name}
							description={repo.description}
							lastPushed={this.formatDate(repo.pushed_at)}
							stars={repo.stargazers_count}
							forks={repo.forks_count}
							openIssues={repo.open_issues_count}
							url={repo.git_url}
						/>
					}) : <h2 className='no-results'>No Results Found</h2>
				}
				<Pagination
					current={this.state.page}
					total={Math.ceil(this.state.total / PER_PAGE)}
					handleClick={this.handlePaginationClick.bind(this)}
				/>
		</div>;
	}



	getRepos() {
		const query = querystring.parse(global.location.hash.slice(1));
		const apiParams = {};

		if (query.page) {
			apiParams.page = query.page;
		}

		if (query.search) {
			apiParams.text = query.search;
		}

		if (query.sort) {
			apiParams.sort = query.sort;
		}

		// first parse out queryString params...
		// @todo grab endpoint from config
		return global.fetch(`https://smiwuru1k0.execute-api.us-east-1.amazonaws.com/dev/repos?${querystring.stringify(apiParams)}`)
			.then(x => x.json())
			.then(resp => {
				const stateUpdates = {
					total : parseInt(resp.total, 10),
					repos: resp.results
				};
				if(query.page) {
					stateUpdates.page = parseInt(query.page, 10);
				}
				this.setState(_.extend({}, this.state, stateUpdates));
				global.scroll(0,0);
			});
	}

	handlePaginationClick(selected) {
		if (selected === 'prev') {
			updateHash({page : this.state.page - 1});
			return ;
		}

		if (selected === 'next') {
			updateHash({page : this.state.page + 1});
			return ;
		}
		updateHash({page : selected});
	};

	componentDidMount() {


		global.addEventListener('hashchange', () => {
			this.getRepos();
		});

		this.getRepos();

	}
}
