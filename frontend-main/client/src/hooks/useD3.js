import React from 'react';
import * as d3 from 'd3';

/**
 * Used to allow d3 to interact with the DOM, from:
 * https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app
 *
 * @param renderChartFn     callback containing d3 code
 * @param dependencies      fixed-length array (says when to run renderChartFn) for updating and rerendering
 * @returns {React.MutableRefObject<undefined>}
 */
export const useD3 = (renderChartFn, dependencies) => {
    const ref = React.useRef();

    React.useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);
    return ref;
}