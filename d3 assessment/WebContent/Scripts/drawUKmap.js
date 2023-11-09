/*D3 assessment: approach
1. Initialise a SVG container using d3.js to display a map. 
2. Create a container for the map within an SVG box and center the map in it.
3. Create a slider ranging from 1 - 100 with initial value as 50. Changes in slider value triggers a function to 
fetch and plot locations on the map. Hover ont he locations displays the name of location and the population.
4. Implement a reload button to clear the map of locations and to fetch and display a new set of locations.
*/

// Define the width and height of the map container to fit the browser display
const width = window.innerWidth;
const height = window.innerHeight;

//create a SVG container using d3.js library
const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// initialize box size and margin within which the UK map will be rendered
const boxSize = Math.min(width, height);
const margin = Math.min(width, height);

// find the center of the display/page
const centerX = width / 2;
const centerY = height / 2;

// Calculate the top-left corner of the box based on its size
const boxX = centerX - (boxSize / 2);
const boxY = centerY - (boxSize / 2);

// Defining the projection for the UK map to be Mercator
const projection = d3.geoMercator()
    .center([0, 54.5]) // Center of the UK
    .scale(2000) // Scale the map to fit the outer box
    .translate([(centerX/1.65), (centerY/0.95)]); // Center the map. These are the settings that worked during my testing.

const path = d3.geoPath().projection(projection);

// Create a svg group element and apply translation to position within it within the SVG container
const boxGroup = svg.append('g')
    .attr('transform', `translate(${boxX}, ${boxY})`);

// Append the box group for customization
boxGroup.append('rect')
    .attr('width', boxSize)
    .attr('height', (boxSize + 30))
    .style('fill', 'blue')
    .style('stroke', 'black');

// Create a group for the map within the box defined above
const mapGroup = boxGroup.append('g')

// Fetch and draw the UK map
//d3.json('http://localhost:8000/united-kingdom.geojson').then(function(data) {
 
d3.json('https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/united-kingdom.geojson').then(function(data) {
    mapGroup.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', 'grey')
        .style('opacity', '1')
        .style('stroke', 'black');
});

// Function to get the locations to plot on the UK map. Slider decides the number of locations to fetch between 50 & 500
function getandplotlocations(locations) {
// Remove existing circles before fetching and pltting new set
    mapGroup.selectAll('circle').remove();

// Get location details based on the slider value
    const jsonURL = `http://34.38.72.236/Circles/Towns/${locations}`;
// If data is returned from url - define function to derive lat, lang, other details
    d3.json(jsonURL).then(function(locData) {
        mapGroup.selectAll('circle.location')
            .data(locData)
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                return projection([d.lng, d.lat])[0];
            })
            .attr('cy', function(d) {
                return projection([d.lng, d.lat])[1];
            })
            .attr('r', function(d) {
                const radiusScale = d3.scaleLinear()
                    .domain([0, d3.max(locData, d => d.Population)])
                    .range([5, 10]);
                return radiusScale(d.Population);
            })
            .style('fill', 'black')
            .append('title')
            .text(function(d) {
                return d.Town + '\nPopulation: ' + d.Population;
            });
    }).catch(function(error) {
        console.error('Error fetching JSON:', error);
    });
}

// Create and position the slider
const sliderContainer = document.createElement('div');
sliderContainer.style.textAlign = 'center'; 
const slider = document.createElement('input');
slider.type = 'range';
slider.min = 1;    // Min value for the slider
slider.max = 500;  // Max value for the slider
slider.value = 50; // Initial value

//Create a value display for the slider to indicate the value of slider at any point
const sliderValueDisplay = document.createElement('div');
sliderValueDisplay.textContent = slider.value;
//on obtaining slide input, pass the value to the function to obtain specified number of location details
slider.oninput = function() {
    mapGroup.selectAll('circle').remove(); // Clear the map content
    sliderValueDisplay.textContent = this.value;//set slider value based on slider location
    getandplotlocations(this.value); // call the function to pass the slider value and obtain location details
};

sliderContainer.appendChild(slider);
sliderContainer.appendChild(sliderValueDisplay);
document.body.appendChild(sliderContainer);

// Initial fetch based on the default value of the slider
getandplotlocations(slider.value);


document.getElementById('reloadButton').addEventListener('click', function() {
    // Reset slider value to the initial state (50 here)
    slider.value = 50;
    
    // Update the slider value display
    sliderValueDisplay.textContent = slider.value;
    
    // Clear existing circles and plot locations with the initial slider value
    mapGroup.selectAll('circle').remove();
    getandplotlocations(slider.value);
});