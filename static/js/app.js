const URL = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Build the metadata panel
function buildMetadata(subject_id) {
  d3.json(URL).then((data) => {

    // Get the metadata field
    const metadata = data.metadata;
  
    // Filter the metadata for the object with the desired sample number
    const filteredMetadata = metadata.filter(obj => obj.id == subject_id);

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Clear any existing metadata
    metadataPanel.html("");

    // Append new tags for each key-value in the filtered metadata
    // Loop through each key-value pair in the filtered metadata
    Object.entries(filteredMetadata[0]).forEach(([key, value]) => {
      // Append each key-value pair as an HTML tag
      metadataPanel.append("p").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(subject_id) {
  d3.json(URL).then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const filteredSamples = samples.filter(obj => obj.id === subject_id);

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = filteredSamples[0].otu_ids;
    const otu_labels = filteredSamples[0].otu_labels;
    const sample_values = filteredSamples[0].sample_values.slice(0, 10);

    // Build a Bubble Chart
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode:'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];

    const bubbleLayout = {
      title: 'Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    const barChartData = [{
      x: sample_values.reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barChartData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json(URL).then((data) => {
    // Get the names field
    const ids = data.names;
  
    // Use d3 to select the dropdown with id of `#selDataset`
    let select = d3.select("#selDataset");

    // Populate the select options
    ids.forEach(id => {
      select.append("option").attr("value", id).text(id);
    });

    // Build charts and metadata panel with the first sample
    optionChanged(ids[0]);
  });
}

// Function for event listener
function optionChanged(subject_id) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(subject_id);
  buildMetadata(subject_id);
}

// Initialize the dashboard
init();
