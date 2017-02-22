import React from 'react';
import ReactDOM from 'react-dom';

const DEFAULT_LINKS_FROM_CENTER = 4;

export default class Sorter extends React.Component {
	constructor(props) {
		super(props);
	}

	generateLinkArray(current, total) {
		let links = [];
		const linksFromCenter = (parseInt(this.props.linksFromCenter, 10) || DEFAULT_LINKS_FROM_CENTER);
		const possibleStart = current - linksFromCenter;
		const possibleEnd = (current + linksFromCenter) > total ? total : (current + linksFromCenter);

		for (var i = possibleStart;  i<possibleEnd; i++){
			if (i >= 0 && i < total) {
				if (i === current) {
					links.push({
						className : 'pagination-item active',
						text : i + 1,
						key : i
					});
				} else {
					links.push({
						className : 'pagination-item',
						text : i + 1,
						key : i
					});
				}
			}
		}

		return links;
	}

	clickHandler(val) {
		return (e) => {
			this.props.handleClick(val);
			e.preventDefault();
		};
	}

	// @todo this should come from shared location
	render() {
		const total = parseInt(this.props.total, 10);
		const current = parseInt(this.props.current, 10) || 0;
		return <ul className="component-pagination">
			{
				(() => {
					if (current > 0) {
						return <li className="prev"><a href="" onClick={this.clickHandler('prev')} >&lt;</a></li>;
					}
				})()
			}
			{this.generateLinkArray(current, total).map((l) => {
				return <li className={l.className} key={l.key}>
					<a href="" onClick={this.clickHandler(l.key)}>{l.text}</a>
				</li>;
			})}

			{(() => {
				if (current < total - 1) {
					return <li className="next"><a href="" onClick={this.clickHandler('next')}>&gt;</a></li>;

				}
			})()}
		</ul>;
	}

}
