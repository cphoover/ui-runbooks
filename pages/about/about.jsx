import React from 'react';
import Navigation from '../../components/navigation/navigation.jsx';

export default class About extends React.Component {
	constructor(props) {
		super(props);
	}
	handleChange(event) {
		this.setState({
			message: event.target.value
		});
	}
	render() {
		return <div id='page-about'>
				<Navigation />
				<h1>About</h1>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in rhoncus lorem, non viverra odio. Maecenas imperdiet mollis feugiat. Cras vestibulum venenatis velit, ut volutpat libero viverra scelerisque. Phasellus eu volutpat mi. Sed eget erat eu mi ultricies tempus. Donec at tellus ex. Praesent ut efficitur quam, vitae tempor libero. Pellentesque aliquet ex tellus, nec eleifend magna tristique id. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris ac euismod libero. Nunc at massa vel enim pharetra ullamcorper. Fusce aliquam nulla sit amet nulla sagittis fermentum.
				</p>
				<p>
					Aliquam vitae feugiat magna. Donec non finibus nisi. Fusce non leo sodales, porttitor magna tincidunt, interdum est. Nulla consequat lorem id lorem sollicitudin viverra. Ut cursus sollicitudin molestie. Suspendisse finibus lectus risus, iaculis congue mauris pellentesque in. In vel tellus sapien.
				</p>
				<p>
					Quisque pretium tellus tellus, vel cursus sem pretium ac. Praesent venenatis, nunc a ultrices pretium, urna nisi commodo sem, non ornare sapien sem non purus. Aliquam dapibus neque urna, sit amet lobortis lectus posuere ut. Nam tortor eros, mattis quis euismod non, volutpat sodales enim. Suspendisse urna diam, sollicitudin et orci vel, viverra fringilla felis. Vestibulum elementum, nisi ut aliquam pretium, metus nisl accumsan velit, quis aliquam enim felis nec nunc. Mauris eros nisi, faucibus sed lacinia quis, pretium non dui. Nullam laoreet elit turpis, vel cursus eros porttitor ac. Phasellus egestas ultricies odio, nec sollicitudin quam malesuada eget. Duis est risus, pharetra nec odio et, porttitor pellentesque urna. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent eget laoreet ante, sed ullamcorper lorem. Sed sollicitudin quam ut commodo pulvinar. Duis aliquam elementum ligula nec laoreet. Donec pharetra ultrices dapibus. Sed posuere, neque in volutpat lobortis, odio turpis elementum risus, sit amet ultricies purus augue at magna.
				</p>
				<p>
					Maecenas at enim tellus. Pellentesque eget metus urna. Quisque dapibus ornare sagittis. Pellentesque sit amet dolor neque. Maecenas ut nibh semper, pharetra ante eu, mollis urna. Aliquam erat volutpat. Phasellus viverra lectus ac congue porttitor. Vestibulum fringilla faucibus dui sit amet tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras a augue arcu. Vestibulum fermentum fermentum elit, at dapibus orci tristique sit amet.
				</p>
		</div>;
	}
}
/*
var React = require('react');
var ReactDOM = require('react-dom');
ReactDOM.render(React.createElement(About), document.body);
*/
