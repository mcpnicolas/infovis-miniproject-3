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