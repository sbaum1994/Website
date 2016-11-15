import React from 'react';
import HelloSayer from './HelloSayer.jsx';

class HelloForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: 'world' };
	}

	onChange(e) {
		this.setState({ name: e.target.value });
	}

	render() {
		return (<div className="hello-form">
			<input name="hello-text" type="text" onChange={this.onChange.bind(this)} />
			<HelloSayer name={this.state.name} />
		</div>);
	}
}

export default HelloForm;