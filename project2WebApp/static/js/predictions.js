// --------------------------
// --------------------------
// Graph predictions
// --------------------------
// --------------------------
// definir svg

let svgPredict = d3
    .select("#graphPrediction")
    .append("svg")
    .attr("height", svgHeight + 270)
    .attr("width", svgWidth + 100)
let chartGroupPredict = svgPredict
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let getPrediction = () => {
    d3.json("/api/getPrediction", {
        method: "GET",
    }).then(
        data => {
            console.log("++++++++++++++++++++++++++++++++++++++++")
            console.log(data.map(item => item.pronostico))
            data.map(d => d.valororig = +d.valororig);
            data.map(d => d.pronostico = +d.pronostico);
            let names = data.map(d => d.nombre)
            let pro = data.map(d => d.pronostico)
            let valororig = data.map(d => d.valororig )

            let trace = {
                x: names,
                y: pro,
                mode: "markers",
                type: "scatter",
                name: "Pronostico",
                text:[pro],
                marker: {size: 12}
            }
            let trace1 = {
                x: names,
                y: valororig,
                mode: "markers",
                type: "scatter",
                name: "Valor",
                text:[valororig],
                marker: {size: 12}
            }

            let datos = [trace, trace1];

            let layout = {
                title: "Predicciones",
                xaxis: {
                    title: "Estaciones"
                },
                yaxis: {
                    autorange: true,
                }
            }
            Plotly.newPlot("graphPrediction", datos, layout);
                
        }).catch(error => console.log(error))
}

d3.select(window).on("load", getPrediction());