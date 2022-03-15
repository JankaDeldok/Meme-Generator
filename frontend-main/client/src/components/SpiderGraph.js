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

const fakeData = [
    {id: 7, upvotes: 10,   downvotes: 5, textboxes: 1},
]
const SpiderGraph = ({data}) => {
    //load sample data if no data can be found
    if(!data){
        data =  [
            {id: 1, upvotes: 1,   downvotes: 1, textboxes: 1},
        ]
    }
    data = data.concat(fakeData);

    const ref = useD3(
        (svg) => {

            //getting html element so we can dynamically set the height and width of the diagramm
            const htmlElement = svg._groups[0][0];
            const margin = { top: 20, right: 20, bottom: 30, left: 10 };
            const height = htmlElement.clientHeight - margin.top - margin.bottom;
            const width = htmlElement.clientWidth - margin.right - margin.left;
            const dimensions = Object.keys(data[0]); //list of dimensions for plot

            svg = svg
                .select(".parallel")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            // For each dimension we want to build a linear scale
            let y = {};
            dimensions.forEach( dimension => {
                //maybe use max and 0 instead?
                //for downvotes reverse scale, for all other normal scale
                if(dimension === "downvotes"){
                    y[dimension] = d3.scaleLinear()
                        .domain(d3.extent(data, function(d) { return +d[dimension]; }).reverse())
                        .range([height, 0]);
                } else {
                    y[dimension] = d3.scaleLinear()
                        .domain(d3.extent(data, function(d) { return +d[dimension]; }))
                        .range([height, 0]);
                }
            })

            //Build the x scale
            let x = d3.scalePoint().range([0,width]).padding(0.5).domain(dimensions);

            // The path function takes an element of the data, and return x and y coordinates of the line to draw for this raw.
            function path(d) {
                return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            }

            //Draw the lines
            svg
                .selectAll("myPath")
                .data(data)
                .enter()
                .append("path")
                .attr("d",  path)
                .style("fill", "none")
                .style("stroke", "#69b3a2")
                .style("opacity", 0.5)

            //dynamic adding of y axis with different scaling each
            svg
                .selectAll("myAxis")
                .data(dimensions).enter()
                .append("g")
                // I translate this element to its right position on the x axis
                .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                // And I build the axis with the call function
                .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); }) //setting number of ticks
                // Add axis title
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; })
                .style("fill", "#00e5c4")

        },
        [data.length]
        );
    return (
       <div>
           <svg className={"spidergraph"}
               ref={ref}
               style={{
                   height: "100%",
                   width: "100%",
               }}
           >
               <g className="parallel" />
           </svg>
       </div>
    );
}
export default SpiderGraph;