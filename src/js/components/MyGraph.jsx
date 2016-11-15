import React from 'react';
import * as d3 from "d3";

class MyGraph extends React.Component {
	constructor(props) {
		super(props);
		this.state = { data: [
			{date:"1-May-12",close:"58.13"},
			{date:"30-Apr-12",close:"53.98"},
			{date:"27-Apr-12",close:"67.00"},
			{date:"26-Apr-12",close:"89.70"},
			{date:"25-Apr-12",close:"99.00"}] }
	}

	// function for turning state data into graph constants
	// then render final graph in render method (important)

	/*
		caravel has slices that contain any graph object, these slices can 
		be pulled into the area of the space and change sizes, resulting in rerendering
		of the graphs.

		slices have a json endpoint linking to their backend viz objects,
		when you call this json endpoint it will return the json with the viz data
		points

		py creates a viz object (which can be vizzed in several ways)
		that it passes back up here to the front end which includes data points to help 
		render the object
	*/

	draw(data) {
		// set the dimensions and margins of the graph
		const margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

		// parse the date / time
		const parseTime = d3.timeParse("%d-%b-%y");

		// set the ranges
		const x = d3.scaleTime().range([0, width]);
		const y = d3.scaleLinear().range([height, 0]);

		// define the line
		const valueline = d3.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.close); });

		// append the svg obgect to the body of the page
		// appends a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		const svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");


		// using immutable js we would replace state with the new state object/create an immutable
		// object at the start with the right stuff
		data.forEach(function(d) {
			d.date = parseTime(d.date);
			d.close = +d.close;
		});
		// This appears to be good practice when the format of the number being pulled out of
		// the data may not mean that it is automagically recognised as a number. This line will
		// ensure that it is.

		// Scale the range of the data
		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([0, d3.max(data, function(d) { return d.close; })]);
		// Add the valueline path.

		svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", valueline);

		// Add the X Axis
		svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

		// Add the Y Axis
		svg.append("g")
		.call(d3.axisLeft(y));
	}

	onChange(e) {
		let ndata = this.state.data
		ndata[0] = { date:"1-May-12", close:e.target.value }
		this.setState({ data: ndata });
	}

	render() {
		return (<div className="histogram">
			{this.draw(this.state.data)}
			<input name="data-point-change" type="text" onChange={this.onChange.bind(this)} />
		</div>
		);
	}
}

export default MyGraph;