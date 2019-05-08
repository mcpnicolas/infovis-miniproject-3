let store = {}

function loadData() {
	return Promise.all([
		d3.csv("aiddata-countries-only.csv"),
	]).then(datasets => {
		store.aiddata = datasets[0]
		console.log("Loaded AidData dataset")
		return store;
	})
}

function groupByDonors(data) {
	let result = data.reduce((result, d) => {
		let currentCountry = result[d.donor] || {
			"Country": d.donor,
			"TotalDonated": 0,
			"Recipients": {}
		}
		if (!currentCountry.Recipients[d.recipient]) {
			currentCountry.Recipients[d.recipient] = {
				"Country": d.recipient,
				"Amount": 0
			}
		}
		currentCountry.Recipients[d.recipient].Amount += parseInt(d.commitment_amount_usd_constant)
		currentCountry.TotalDonated += parseInt(d.commitment_amount_usd_constant)

		result[d.donor] = currentCountry
		return result
	},{})

	// Convert to array
	result = Object.keys(result).map(key => result[key])
	result.sort((a, b) => {
		return d3.descending(a.TotalDonated,b.TotalDonated)
	})
	return result
}

function groupByPurpose(data) {
	let result = data.reduce((result, d) => {
		let currentPurpose = result[d.coalesced_purpose_name] || {
			"Purpose": d.coalesced_purpose_name,
			"TotalAmount": 0,
			"Donations": {}
		}
		if (!currentPurpose.Donations[d.donor]) {
			currentPurpose.Donations[d.donor] = {
				"Donor": d.donor,
				"Amount": 0
			}
		}
		currentPurpose.Donations[d.donor].Amount += parseInt(d.commitment_amount_usd_constant)
		currentPurpose.TotalAmount += parseInt(d.commitment_amount_usd_constant)
		result[d.coalesced_purpose_name] = currentPurpose
		return result
	},{})

	// Convert to array
	result = Object.keys(result).map(key => result[key])
	result.sort((a, b) => {
		return d3.descending(a.TotalAmount,b.TotalAmount)
	})
  	return result
}