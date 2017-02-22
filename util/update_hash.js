import queryString from 'querystring';
import _ from 'lodash';

export default function updateHashQuery(update) {
	const existing = queryString.parse(global.location.hash.substr(1));
	global.location.hash = queryString.stringify(_.extend(existing, update));
}
