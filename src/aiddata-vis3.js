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

    let colorScale = d3.scaleOrdinal()
        .domain(Object.keys(5))
        .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854']) 

    links.forEach(function(link) {
        sourceIndex = nodes[link.source].index
        targetIndex = nodes[link.target].index

        nodes[link.source].countDonate++
        nodes[link.source].countPurpose[link.purposeIndex]++
        nodes[link.target].countPurpose[link.purposeIndex]++
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
    
}