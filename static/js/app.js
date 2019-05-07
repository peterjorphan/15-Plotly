function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((sampleMetadata) => {
    var metaData = sampleMetadata;

    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
      .html("")
      
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(metaData).forEach(pair => {
        d3.select("#sample-metadata")
        .append("p")
        .text(`${pair[0]}: ${pair[1]}`)
      })
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampleData) => {

    // @TODO: Build a Bubble Chart using the sample data
    d3.select("#bubble")
      .html("")
      var trace1 = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        mode: 'markers',
        type: 'scatter',
        text: sampleData.otu_labels,
        marker: {
          size: sampleData.sample_values, 
          color: sampleData.otu_ids
        }
      };

      var bubbleData = [trace1];

      Plotly.newPlot('bubble', bubbleData, {responsive: true});

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // Create array with value/index pair objects
    var sampleValues = []
    sampleData.sample_values.map((x, i) => sampleValues[i] = {x, i});
    console.log(sampleValues)

    // Sort the list by the values of the pairs and slice the top 10
    var slicedSampleValues = sampleValues.sort(function(a, b){return b.x - a.x}).slice(0,10);
    console.log(slicedSampleValues)   

    // Create arrays for the sliced values and indices
    var pieValues = slicedSampleValues.map(a => a['x']);
    console.log(pieValues)
    var indices = slicedSampleValues.map(a => a['i']);
    console.log(indices)

    // Use the sliced indices to create arrays for the labels and hovertext
    var pieLabels = indices.map(i => sampleData.otu_ids[i]);
    console.log(pieLabels)
    var pieHovertext = indices.map(i => sampleData.otu_labels[i]);
    console.log(pieHovertext)

  d3.select('#pie')
    .html("")
    var trace2 = {
      values: pieValues,
      labels: pieLabels,
      hovertext: pieHovertext,
      type: "pie"
    };

    var pieData = [trace2];

    Plotly.newPlot("pie", pieData, {responsive: true});

  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
