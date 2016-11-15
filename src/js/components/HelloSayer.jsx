import React from 'react';

class HelloSayer extends React.Component {
	render() {
		return <p className="hello">Hello {this.props.name}!</p>;
	}
}

export default HelloSayer;