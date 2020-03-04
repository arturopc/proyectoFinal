

// --------------------------
// --------------------------
// Get function
// --------------------------
// --------------------------

// definir svg
let svgHeight = 500;
let svgWidth = 960;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
}

let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

let svg = d3
    .select("#graphState")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

let chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    let svg2 = d3
    .select("#graphStateMax")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

let chartGroup2 = svg2
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    let svg3 = d3
    .select("#graphStateMin")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

let chartGroup3 = svg3
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let consigue = () => {
    d3.json("/api/consigue", {
        method:"GET",

    }).then(
        data => {
        console.log(data.map(item => item.valororig))
        //-------------------------------------------------------
        //--------------------First Graph------------------------
        //-------------------------------------------------------
        data.map(d => d.valororig = +d.valororig);

        let xScale = d3.scaleBand()
            .domain(data.map(d => d.estado))
            .range([0, chartWidth])
            .padding(0.1)

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d.valororig))])
            .range([chartHeight, 0])

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis)
            .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-30)" 
                    });

        chartGroup.append("g")
            .call(yAxis)
        
        chartGroup.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.estado))
            .attr("y", d => yScale(d.valororig))
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - yScale(d.valororig))
            .attr("fill", "#DE615A");

        //-------------------------------------------------------
        //--------------------Second Graph-----------------------
        //-------------------------------------------------------
        var top5 = data.sort(function(a, b) {
            return d3.descending(+a.valororig, +b.valororig);
        }).slice(0, 5);
    
        top5.forEach(d => console.log(d.estado))

        let xScale1 = d3.scaleBand()
            .domain(top5.map(d => d.estado))
            .range([0, chartWidth])
            .padding(0.1)
    
        let yScale1 = d3.scaleLinear()
            .domain([0, d3.max(top5.map(d => d.valororig))])
            .range([chartHeight, 0])
    
        let xAxis1 = d3.axisBottom(xScale1);
        let yAxis1 = d3.axisLeft(yScale1);
    
        chartGroup2.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis1)
            .selectAll("text")	
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-30)" 
                    });
    
        chartGroup2.append("g")
            .call(yAxis1)
        
        chartGroup2.selectAll(".bar")
            .data(top5)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale1(d.estado))
            .attr("y", d => yScale1(d.valororig))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => chartHeight - yScale1(d.valororig))
            .attr("fill", "#CC536F");

        //-------------------------------------------------------
        //--------------------Third Graph-----------------------
        //-------------------------------------------------------
        var bottom5= data.sort(function(a, b) {
            return d3.ascending(+a.valororig, +b.valororig);
        }).slice(0, 5);

        bottom5.forEach(d => console.log(d.estado))

        let xScale2 = d3.scaleBand()
            .domain(bottom5.map(d => d.estado))
            .range([0, chartWidth])
            .padding(0.1)
    
        let yScale2 = d3.scaleLinear()
            .domain([0, d3.max(bottom5.map(d => d.valororig))])
            .range([chartHeight, 0])

        let xAxis2 = d3.axisBottom(xScale2);
        let yAxis2 = d3.axisLeft(yScale2);

        chartGroup3.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis2)
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-30)" 
                });
        chartGroup3.append("g")
            .call(yAxis2)

        chartGroup3.selectAll(".bar")
            .data(bottom5)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale2(d.estado))
            .attr("y", d => yScale2(d.valororig))
            .attr("width", xScale2.bandwidth())
            .attr("height", d => chartHeight - yScale2(d.valororig))
            .attr("fill", "#DE805A");
    }).catch(error => console.log(error))
}
d3.select(window).on("load", consigue());