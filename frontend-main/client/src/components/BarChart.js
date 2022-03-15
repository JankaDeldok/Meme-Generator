import React from "react";
import * as d3 from 'd3';
import {useD3} from "../hooks/useD3";
//  * Using d3 in react:
//  * https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app
//  * the parallel chart from:
//  * https://www.d3-graph-gallery.com/graph/parallel_basic.html

/**
 * A spider chart using d3 for stats about the templates.
 * Takes data [{k1:v1, ... ,kn:vn}*] (List of objects with the same keys)
 */
//Sample data for spider chart, appended later
const BarChart = ({data}) => {

    //load sample data if no data can be found
    if(!data){
        data =  [
            {nomeme_data: 1, upvotes: 4,   downvotes: 1, textboxes: 3},
        ]
    }
    console.log(data);

    const ref = useD3(
        (svg) => {
            console.log("Using d3, just now the stats are updated");

            //getting html element so we can dynamically set the height and width of the diagramm
            const htmlElement = svg._groups[0][0];
            const margin = { top: 20, right: 20, bottom: 50, left: 30 };
            const height = htmlElement.clientHeight - margin.top - margin.bottom;
            const width = htmlElement.clientWidth - margin.right - margin.left;
            const dimensions = Object.keys(data[0]); //list of dimensions for plot

            svg = svg
                .select(".charts");
            svg.selectAll("g").remove(); //removing old stats to draw new
            svg = svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .append("g");

            //Following the basic barplot example from https://www.d3-graph-gallery.com/graph/barplot_basic.html
            // X axis
            let x = d3.scaleBand()
                .range([ 0, width ])
                .domain(dimensions)
                .padding(0.2);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            //calculating the max value needed on the y-axis
            let maxY = 0;
            dimensions.forEach(dimension => {
                let max = d3.max(data, function(d) { return +d[dimension];});
                if(maxY < max) maxY = max;
            })
            // Add Y axis
            let y = d3.scaleLinear()
                .domain([0, maxY]) //setting the domain dynamically to max in data
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y).ticks(5)) //setting the axis to left and just allowing 5 ticks

            //For each dimension we want to add bars for each dataset
            dimensions.forEach((dimension, index) => {
                let singleMeme = false;  // used to place bars next to each other, changes with every bar
                let color = "#00e5c4";
                // Bars for single meme
                svg.selectAll("mybar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", function() { //if index is odd place right vom last bar
                        singleMeme = !singleMeme;
                        if(singleMeme) {
                            return 1 + x(dimension);
                        }
                        else {
                            return 1 + x(dimension)+x.bandwidth()/2;
                        }
                    })
                    .attr("y", function(d) {
                        return y(d[dimension]); })
                    .attr("width", x.bandwidth()/2 - 1)
                    .attr("height", function(d) { return height - y(d[dimension]); })
                    .attr("fill", function (){
                        if(color==="#00e5c4"){
                            color = "#003ce5";
                        } else {
                            color = "#00e5c4";
                        }
                        return color;
                    })
                ;


            });

            console.log("Stats loaded.");
        }
    );
    return (
        <div>
            <svg className={"barchart"}
                 ref={ref}
                 style={{
                     height: "100%",
                     width: "100%",
                 }}
                >
                <g className="charts" />
            </svg>
        </div>
    );
}
export default BarChart;