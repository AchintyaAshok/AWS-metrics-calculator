const fs = require('fs')
const dateFormat = require('dateformat')
const argv = require('yargs').argv

if (argv.filePath === undefined || argv.metric === undefined) {
  throw new Error('Must provide a filePath & metric')
}

/**
Get the source file.
*/
const readSourceFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8')
}

const massageAndSortData = (data) => {
  let dataPoints = data['Datapoints']
  for (let d of dataPoints) {
    d['Date'] = new Date(d['Timestamp'])
  }

  dataPoints.sort((a, b) => {
    return a['Date'] - b['Date']
  })

  return dataPoints
}

const getAverageForMetric = (dataPoints, metricName) => {
  let metricByDate = dataPoints.map(d => {
    let p = {
      d: dateFormat(d['Date'], 'mm/dd/yy @ h:MM:ss TT')
    }
    p[metricName] = d[metricName]

    return p
  })
  console.log('Metrics By Date: ', metricByDate)

  let sumData = 0

  dataPoints.map(d => {
    sumData += d[metricName]
  })

  return (sumData / dataPoints.length)
}

const getMaxForMetric = (dataPoints, metricName) => {
  let collectedMetricPoints = dataPoints.map(d => d[metricName])
  return Math.max(...collectedMetricPoints)
}

const calculateAverageForStatistics = () => {
  console.log(`FilePath: ${argv.filePath} | Metric: ${argv.metric}`)

  // First read the file
  const rawData = readSourceFile(argv.filePath)

  if (!rawData) {
    throw new Error('Unable to read sourcefile')
  }

  const data = JSON.parse(rawData)
  const dataPoints = massageAndSortData(data)

  const calculatedAvgForMetric = getAverageForMetric(dataPoints, argv.metric)
  const calculatedMaxForMetric = getMaxForMetric(dataPoints, argv.metric)
  console.log(`\n\tAverage: ${calculatedAvgForMetric}`)
  console.log(`\tMax: ${calculatedMaxForMetric}`)
}

calculateAverageForStatistics()
