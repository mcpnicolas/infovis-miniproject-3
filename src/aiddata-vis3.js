function drawLegendVis3Chart(config, colorScale) {
	let {container, margin, height, width} = config;
	let xLegend = 5
	let yLegend = -5

	let legend = container.append("g")
        .attr("class", "legend")
        
    legend.append("text")
		.attr("x", xLegend+400)
		.attr("y", yLegend+70)
        .text("Recipient Countries")
        .style("font-weight",700)

    legend.append("text")
		.attr("x", xLegend-500)
		.attr("y", yLegend+20)
        .text("Donor Countries")
        .style("font-weight",700)
        .attr("transform", `rotate(-90)`)
	
	legend.append("circle")
		.attr("cx", 4*xLegend)
		.attr("cy", yLegend+11)
		.attr("r", 5)
		.attr("fill", colorScale(0))

	legend.append("text")
		.attr("x", 4*xLegend+10)
        .attr("y", yLegend+15)
        .text("Air transport")
		
	legend.append("circle")
		.attr("cx", 4*xLegend)
		.attr("cy", yLegend+30)
		.attr("r", 5)
		.attr("fill", colorScale(1))

	legend.append("text")
		.attr("x", 4*xLegend+10)
        .attr("y", yLegend+35)
        .text("Rail transport")

	legend.append("circle")
		.attr("cx", 4*xLegend)
		.attr("cy", yLegend+50)
		.attr("r", 5)
		.attr("fill", colorScale(2))

	legend.append("text")
		.attr("x", 4*xLegend+10)
		.attr("y", yLegend+55)
		.text("Industrial development")

	legend.append("circle")
		.attr("cx", 4*xLegend)
		.attr("cy", yLegend+70)
		.attr("r", 5)
		.attr("fill", colorScale(3))

	legend.append("text")
		.attr("x", 4*xLegend+10)
		.attr("y", yLegend+75)
		.text("Rescheduling & refinancing")
	
	legend.append("circle")
		.attr("cx", 4*xLegend)
		.attr("cy", yLegend+90)
		.attr("r", 5)
		.attr("fill", colorScale(4))

	legend.append("text")
		.attr("x", 4*xLegend+10)
		.attr("y", yLegend+95)
		.text("Power generation & non-renewable sources")
}

function drawAxesVis3Chart(xScale, yScale, config) {
    let { container, margin, bodyHeight, bodyWidth } = config

    let xAxis = d3.axisTop(xScale).tickSize(-(bodyHeight))
	container.append("g")
		.style("transform", `translate(${margin.left+8}px,${margin.top}px)`)
		.call(xAxis)
		.attr("class", "axis-top")
		.selectAll("text")
		.attr("transform", `rotate(-90)`)
        .attr("dy", "-0.15em")
        .attr("dx", "0.5em")
        .style("text-anchor", "start")
	
	let yAxis = d3.axisLeft(yScale).tickSize(-(bodyWidth-1))
	container.append("g")
		.style("transform", `translate(${margin.left+1}px,${margin.top+8}px)`)
		.call(yAxis)
        .attr("class", "axis-left")
        .selectAll("text")
        .attr("dy", "-0.5em")
}

function drawVis3Chart(purposes, network, config) {
    let { margin, bodyWidth, bodyHeight, width, height, container } = config

    let matrix = [],
        nodes = network.nodes,
        links = network.links,
        n = Object.keys(nodes).length

    Object.keys(nodes).forEach(function(key, i) {
        nodes[key].index = i;
        nodes[key].countDonate = 0;
        nodes[key].countPurpose = [0,0,0,0,0];
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: [0,0,0,0,0]}; })
    });

    let min = d3.min(links, d => d.amount)
    let max = d3.max(links, d => d.amount)
    let range = max - min
    //console.log(min)
    //console.log(max)

    let colorScale = d3.scaleOrdinal()
        .domain(Object.keys(5))
        .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854']) 

    links.forEach(function(link) {
        sourceIndex = nodes[link.source].index
        targetIndex = nodes[link.target].index

        nodes[link.source].countDonate++
        nodes[link.source].countPurpose[link.purposeIndex] += 1
        nodes[link.target].countPurpose[link.purposeIndex] += 1
        matrix[sourceIndex][targetIndex].z[link.purposeIndex] = link.amount
    });
    //console.log(matrix)

    let nodeArr = Object.keys(nodes).map(key => nodes[key])
    let nodeI = []

	nodeArr.sort((a, b) => {
        let purposeA = a.countPurpose.findIndex(function(element) {
            return element == d3.max(a.countPurpose)
        })
        let purposeB = b.countPurpose.findIndex(function(element) {
            return element == d3.max(b.countPurpose)
        })
        return purposeA - purposeB;
    })
    console.log(nodeArr)

    nodeArr.forEach(function(node) {
        nodeI.push(node.index)
    })
    //console.log(nodeI)

    let x = d3.scaleBand()
        .domain(nodeI)
		.range([0, bodyWidth])
	
	let xScale = d3.scaleBand()
        .domain(nodeArr.map(c => c.name))
        .range([0, bodyWidth])
    
	let y = d3.scaleBand()
		.domain(nodeI)
		.range([0, bodyHeight])
    
	let yScale = d3.scaleBand()
		.domain(nodeArr.map(c => c.name))
        .range([0, bodyHeight])

    let body = container.append("g")
        .style("transform", `translate(${margin.left}px,${margin.top}px)`)
        
    let row = body.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + y(i) + ")" })

    let cell = row.selectAll(".cell")
        .data(function(d) { return d })
        .enter()
        .append("svg")
        .attr("x", function(d, i) { return x(i) })
        .attr("class", "cell")
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .append("g")
        .attr("transform", "translate(" + x.bandwidth()/2 + "," +  y.bandwidth()/2 + ")")

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(7.5)

    cell.selectAll("path")
        .data(function(d) {
            return d3.pie()(d.z)
        })
        .enter().append("path")
        .style("fill", function(d, i) { return colorScale(i) })
        .attr("d", arc)

    drawAxesVis3Chart(xScale, yScale, config)
    drawLegendVis3Chart(config, colorScale)
    
}