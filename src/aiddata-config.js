function getVis1ChartConfig() {
	let width = 800;
	let height = 840;
	let margin = {
		top: 150,
		bottom: 10,
		left: 120,
		right: 10
	}
	let bodyHeight = height - margin.top - margin.bottom
	let bodyWidth = width - margin.left - margin.right

	let container = d3.select("#Vis1Chart")
	
	container
		.attr("width", width)
		.attr("height", height)

	return { width, height, margin, bodyHeight, bodyWidth, container }
}

function getVis3ChartConfig() {
	let width = 850;
	let height = 910;
	let margin = {
		top: 170,
		bottom: 10,
		left: 120,
		right: 10
	}
	let bodyHeight = height - margin.top - margin.bottom
	let bodyWidth = width - margin.left - margin.right

	let container = d3.select("#Vis3Chart")
	
	container
		.attr("width", width)
		.attr("height", height)

	return { width, height, margin, bodyHeight, bodyWidth, container }
}