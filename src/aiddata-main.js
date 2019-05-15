function processData() {
	// load data
    let aiddata = store.aiddata
    
	// process data - call functions to group by
    let donors = groupByDonors(aiddata)
    console.log("Vis 1 - All countries with their recipients ",donors)
    let network1 = generateNetwork1(donors)
    console.log("Vis 1 network nodes + links",network1)

    let purposes = groupByPurpose(aiddata)
    let topPurposes = purposes.slice(0,5)
    console.log("Vis 3 - Top 5 purposes with their donors and amounts: ",topPurposes)
    
	// load configs
    let config1 = getVis1ChartConfig()
    // let config3 = getVis3ChartConfig()
    
	// draw charts
    drawVis1Chart(network1, config1)
    // drawVis3Chart(japanRecipients,config3)
}

loadData().then(processData);