// Fetch the data
const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(dataUrl)
	.then((response) => response.json())
	.then((data) => {
		createChart(data);
	})
	.catch((error) => {
		console.error("Error fetching the data:", error);
	});

function createChart(dataset) {
	const w = 800; // Width of the SVG
	const h = 500; // Height of the SVG
	const padding = 60; // Padding around the chart

	// Add a title to the chart (#1)
	d3.select("body").append("h1").attr("id", "title").text("Doping in Professional Bicycle Racing");

	// Create the SVG container
	const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

	// Define scales for x and y axes
	const xScale = d3
		.scaleLinear()
		.domain([d3.min(dataset, (d) => d.Year) - 1, d3.max(dataset, (d) => d.Year) + 1])
		.range([padding, w - padding]);

	const yScale = d3
		.scaleTime()
		.domain([
			d3.min(dataset, (d) => new Date(1970, 0, 1, 0, d.Seconds / 60, d.Seconds % 60)),
			d3.max(dataset, (d) => new Date(1970, 0, 1, 0, d.Seconds / 60, d.Seconds % 60)),
		])
		.range([h - padding, padding]);

	// Create x-axis and append to the chart (#2)
	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	svg.append("g")
		.attr("id", "x-axis")
		.attr("transform", `translate(0, ${h - padding})`)
		.call(xAxis);

	// Add x-axis label
	svg.append("text")
		.attr("x", w / 2)
		.attr("y", h - 20)
		.attr("text-anchor", "middle")
		.text("Year");

	// Create y-axis and append to the chart (#3)
	const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
	svg.append("g").attr("id", "y-axis").attr("transform", `translate(${padding}, 0)`).call(yAxis);

	// Add y-axis label
	svg.append("text")
		.attr("x", -h / 2)
		.attr("y", 20)
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.text("Time of Rider");

	// Append dots for data points (#4, #5, #6, #7, #8)
	svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", (d) => xScale(d.Year)) // User Story #7
		.attr("cy", (d) => yScale(new Date(1970, 0, 1, 0, d.Seconds / 60, d.Seconds % 60))) // User Story #8
		.attr("r", 5)
		.attr("class", (d) => (d["Doping"] === "" ? "dot nodoping" : "dot doping")) // Added nodoping/doping class
		.attr("data-xvalue", (d) => d.Year) // User Story #5
		.attr("data-yvalue", (d) => new Date(1970, 0, 1, 0, d.Seconds / 60, d.Seconds % 60)) // User Story #5
		.on("mouseover", (event, d) => {
			tooltip
				.style("visibility", "visible")
				.html(`${d.Name}, ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}`)
				.attr("data-year", d.Year); // User Story #15
		})
		.on("mousemove", (event) => {
			tooltip.style("top", `${event.pageY + 10}px`).style("left", `${event.pageX + 10}px`);
		})
		.on("mouseout", () => {
			tooltip.style("visibility", "hidden");
		});

	// Add a legend (#13)
	const legend = svg.append("g").attr("id", "legend");

	legend
		.append("rect")
		.attr("x", w - 250)
		.attr("y", padding)
		.attr("width", 15)
		.attr("height", 15)
		.attr("fill", "blue");

	legend
		.append("text")
		.attr("x", w - 230)
		.attr("y", padding + 12)
		.text("No doping allegations");

	legend
		.append("rect")
		.attr("x", w - 250)
		.attr("y", padding + 20)
		.attr("width", 15)
		.attr("height", 15)
		.attr("fill", "orange");

	legend
		.append("text")
		.attr("x", w - 230)
		.attr("y", padding + 32)
		.text("Riders with doping allegations");

	// Add a tooltip (#14, #15)
	const tooltip = d3
		.select("body")
		.append("div")
		.attr("id", "tooltip")
		.style("visibility", "hidden")
		.style("position", "absolute")
		.style("background-color", "lightgray")
		.style("padding", "5px")
		.style("border-radius", "5px");
}
