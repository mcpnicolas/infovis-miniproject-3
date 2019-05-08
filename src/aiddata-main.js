function processData() {
	// load data
	let aiddata = store.aiddata
	// process data - call functions to group by

/* 	console.log("Vis 1 - All countries with yearly net amounts: ",countriesList)
	console.log("Vis 2 - Top 10 purposes with yearly donations: ",topPurposes)
    console.log("Vis 3 - All recipients from Japan with yearly donations: ",japanRecipients) */
    
	// load configs
/* 	let config1 = getVis1ChartConfig()
	let config2 = getVis2ChartConfig()
    let config3 = getVis3ChartConfig() */
    
	// draw charts
/* 	drawVis1Chart(countriesList, config1)
	drawVis2Chart(yearlyPurposesPercent, config2)
	drawVis3Chart(japanRecipients,config3) */
}

loadData().then(processData);