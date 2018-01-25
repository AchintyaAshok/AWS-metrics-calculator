const fs = require('fs')
const sourceFile = '/Users/aashok/Desktop/metrics.json'

/**
Get the source file.
*/
const readSourceFile = (filePath) => {
	return fs.readFileSync(filePath, 'utf8');
}

const massageAndSortData = (data) => {
	let dataPoints = data['Datapoints']
	for(let d of dataPoints) {
		d['Date'] = new Date(d['Timestamp'])
	}

	dataPoints.sort( (a, b) => {
		return a['Date'] - b['Date']
	})

	return dataPoints
}


const getAverageForMetric = (dataPoints, metricName) => {
	let collectedMetricPoints = dataPoints.map(d => d[metricName])
	console.log('Collected Metrics: ', collectedMetricPoints)	

	let sumData = 0
	
	dataPoints.map(d => {
		sumData += d[metricName]
	})

	/*
	for (let p of dataPoints) {
		sumData += parseInt(p)
	}
	*/
	

	return (sumData / dataPoints.length)
}

const getMaxForMetric = (dataPoints, metricName) => {
	let collectedMetricPoints = dataPoints.map(d => d[metricName])
//	console.log('MAX Calculation for: ', collectedMetricPoints)
	return Math.max(...collectedMetricPoints)
}

const calculateAverageForStatistics = (statistics) => {
	// First read the file
	const rawData = readSourceFile(sourceFile)
	
	if(!rawData) {
		throw new Error('Unable to read sourcefile')
	}

	const data = JSON.parse(rawData)
	const dataPoints = massageAndSortData(data)

//	console.log('DATA => ', dataPoints)
	const calculatedAvgForMetric = getAverageForMetric(dataPoints, 'Average')
	const calculatedMaxForMetric = getMaxForMetric(dataPoints, 'Average')
	console.log(`\n\tAverage: ${calculatedAvgForMetric}`)	
	console.log(`\tMax: ${calculatedMaxForMetric}`)

//	console.log(getAverageForMetric(dataPoints, 'Average'))
}

calculateAverageForStatistics(['Average'])
