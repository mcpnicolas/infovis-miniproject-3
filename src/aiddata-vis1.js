function drawAxesVis1Chart(xScale, yScale, config) {
    let { container, margin, height } = config

    let xAxis = d3.axisTop(xScale)
	container.append("g")
		.style("transform", `translate(${margin.left}px,${margin.top-5}px)`)
		.call(xAxis)
		.attr("class", "axis-top")
		.selectAll("text")
		.attr("transform", `rotate(-90)`)
		.attr("dy", "1.25em")
        .style("text-anchor", "start")
	
	let yAxis = d3.axisLeft(yScale)
	container.append("g")
		.style("transform", `translate(${margin.left+5}px,${margin.top}px)`)
		.call(yAxis)
        .attr("class", "axis-left")
}

function drawLegendVis3Chart(colorScale, config) {
    let {container, margin, height, width} = config;
	let xLegend = 20;
    let yLegend = 0;
    
    let legend = container.append("g")
        .attr("class", "legend")

    legend.append("text")
		.attr("x", xLegend+400)
		.attr("y", yLegend+35)
        .text("Recipient Countries")
        .style("font-weight",700)

    legend.append("text")
		.attr("x", xLegend-500)
		.attr("y", yLegend+10)
        .text("Donor Countries")
        .style("font-weight",700)
        .attr("transform", `rotate(-90)`)
    
    legend.append("text")
		.attr("x", xLegend)
		.attr("y", yLegend+12)
        .text("$ Amount Donated")
        
    legend.append("rect")
		.attr("x", xLegend)
		.attr("y", yLegend+20)
		.attr("height", 15)
		.attr("width", 40)
		.attr("fill", colorScale(999999))

	legend.append("rect")
		.attr("x", xLegend+40)
		.attr("y", yLegend+20)
		.attr("height", 15)
		.attr("width", 40)
        .attr("fill", colorScale(1000001))
    
    legend.append("rect")
		.attr("x", xLegend+80)
		.attr("y", yLegend+20)
		.attr("height", 15)
		.attr("width", 40)
        .attr("fill", colorScale(10000001))

    legend.append("rect")
		.attr("x", xLegend+120)
		.attr("y", yLegend+20)
		.attr("height", 15)
		.attr("width", 40)
        .attr("fill", colorScale(100000001))
    
    legend.append("rect")
		.attr("x", xLegend+160)
		.attr("y", yLegend+20)
		.attr("height", 15)
		.attr("width", 40)
        .attr("fill", colorScale(1000000001))
    
    legend.append("text")
		.attr("x", xLegend-5)
		.attr("y", yLegend+50)
        .text("<1M")
        
    legend.append("text")
		.attr("x", xLegend+35)
		.attr("y", yLegend+50)
        .text("1M")
        
    legend.append("text")
		.attr("x", xLegend+70)
		.attr("y", yLegend+50)
        .text("10M")
        
    legend.append("text")
		.attr("x", xLegend+110)
		.attr("y", yLegend+50)
        .text("100M")
        
    legend.append("text")
		.attr("x", xLegend+155)
		.attr("y", yLegend+50)
        .text("1B")
        
    legend.append("text")
		.attr("x", xLegend+185)
		.attr("y", yLegend+50)
		.text(">1B")
}

function drawVis1Chart(network, config) {
    let { margin, bodyWidth, bodyHeight, width, height, container } = config

    let matrix = [],
        nodes = network.nodes,
        links = network.links,
        n = Object.keys(nodes).length

    Object.keys(nodes).forEach(function(key, i) {
        nodes[key].index = i;
        nodes[key].countDonate = 0;
        nodes[key].countReceive = 0;
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: "#e8e8e8"}; })
    });

    let min = d3.min(links, d => d.amount)
    let max = d3.max(links, d => d.amount)
    //console.log(min)
    //console.log(max)

    let colorScale = d3.scaleThreshold()
        .domain([1000000,10000000,100000000,1000000000]) // $1M, $10M, $100M, $1B 
        //.range(["#D7D986","#B5BD64","#95A246","#77872B","#5B6C14"])
        .range(['#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837']) 

    links.forEach(function(link) {
        sourceIndex = nodes[link.source].index
        targetIndex = nodes[link.target].index

        nodes[link.source].countDonate++;
        nodes[link.target].countReceive++;
        matrix[sourceIndex][targetIndex].z = colorScale(link.amount); // later encode with color scale
    });
    //console.log(matrix)

    let nodeArray = Object.keys(nodes).map(key => nodes[key])
    let nodeI = []

	nodeArray.sort((a, b) => {
        return d3.descending(a.countDonate,b.countDonate)
        //return d3.descending(a.countReceive,b.countReceive)
    })

    //console.log(nodeArray)
    nodeArray.forEach(function(node) {
        nodeI.push(node.index)
    })
    //console.log(nodeI)

    let x = d3.scaleBand()
        .domain(nodeI)
		.range([0, bodyWidth])
	
	let xScale = d3.scaleBand()
        .domain(nodeArray.map(c => c.name))
        .range([0, bodyWidth])
    
	let y = d3.scaleBand()
		.domain(nodeI)
		.range([0, bodyHeight])
    
	let yScale = d3.scaleBand()
		.domain(nodeArray.map(c => c.name))
        .range([0, bodyHeight])

    let body = container.append("g")
        .style("transform", `translate(${margin.left}px,${margin.top}px)`)
        
    let row = body.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + y(i) + ")" })
    
    row.selectAll(".cell")
        .data(function(d) { return d })
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", function(d, i) { return x(i) })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill",function(d) { return d.z })
        .style("stroke","#ffffff")
        .style("stroke-width", 0.1)

    d3.selectAll("rect").on("mouseover", mouseover)
    d3.selectAll("rect").on("mouseout", mouseout)

    function mouseover(p) {
        d3.selectAll("rect").style("stroke-width", function(d, i) { 
            if (!d) return 0.1
            return d.x == p.x || d.y == p.y ? 2 : 0.1
        })
    }

    function mouseout() {
        d3.selectAll("rect").style("stroke-width", "0.1")
    }

    drawAxesVis1Chart(xScale, yScale, config)
    drawLegendVis3Chart(colorScale, config)

}