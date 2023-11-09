# d3
d3 plotting
This file defines the approach followed to answer the d3 assessment by Student:Hamsa Ravikumar (2555691)

1. Initialise a SVG container using d3.js. 
2. Create a box group within an SVG container.
3. Draw the UK map by sourcing the UK geojson file from github and center the map inside the box group.
4. Create a slider ranging from 1 - 100 with initial value as 50. Changes in slider value triggers a function to 
fetch and plot locations on the map.
5. getandplotlocations function will clear the map of existing locations plotting and fetches feed of locations to be plotted on the map with slider initialised value if the slider position isn't changed else the slider position value which defines the number of location details to be fetched and plot the locations.
6. Hover on the locations will display the name of location and the population.
7. A reload button to clear the map of existing locations and to fetch and display a new set of locations.
8. Code takes care of resetting the slider to its initilaised value whenever a Reload button is clicked.
9. Code also takes care of resetting the map of existing plots on each slider position chage / reload button, so the new feed is made visible without an interference from previous plots.
10. Code handles the error scenarios to display error messages 
