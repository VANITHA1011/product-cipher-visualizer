import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const D3CaesarVisualization = ({ steps, currentStep, speed }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!steps || steps.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svg.node().getBoundingClientRect().width || 600;
    const height = 200;
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    const visibleSteps = steps.slice(0, currentStep + 1);
    const xScale = d3.scaleLinear().domain([0, Math.max(10, steps.length)]).range([40, width - 40]);
    const g = svg.append('g').attr('transform', 'translate(0, 50)');

    g.selectAll('.orig').data(visibleSteps).enter().append('text').attr('class', 'orig')
      .attr('x', (d, i) => xScale(i)).attr('y', 0).attr('text-anchor', 'middle')
      .attr('fill', '#0891b2').attr('font-size', '20px').attr('font-family', 'monospace')
      .text(d => d.originalChar).style('opacity', 0)
      .transition().duration(500 / speed).style('opacity', 1);

    g.selectAll('.arrow').data(visibleSteps).enter().append('text').attr('class', 'arrow')
      .attr('x', (d, i) => xScale(i)).attr('y', 30).attr('text-anchor', 'middle')
      .attr('fill', '#9ca3af').attr('font-size', '16px').text('↓')
      .style('opacity', 0).transition().delay(250 / speed).duration(500 / speed).style('opacity', 1);

    g.selectAll('.shift').data(visibleSteps).enter().append('text').attr('class', 'shift')
      .attr('x', (d, i) => xScale(i) + 15).attr('y', 30).attr('text-anchor', 'start')
      .attr('fill', '#6b7280').attr('font-size', '10px').text(d => `+${d.shiftAmount}`)
      .style('opacity', 0).transition().delay(250 / speed).duration(500 / speed).style('opacity', 1);

    g.selectAll('.res').data(visibleSteps).enter().append('text').attr('class', 'res')
      .attr('x', (d, i) => xScale(i)).attr('y', 40).attr('text-anchor', 'middle')
      .attr('fill', '#ca8a04').attr('font-size', '20px').attr('font-family', 'monospace').attr('font-weight', 'bold')
      .text(d => d.resultChar).style('opacity', 0)
      .transition().delay(500 / speed).duration(500 / speed).style('opacity', 1).attr('y', 60);
  }, [steps, currentStep, speed]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-white rounded-lg">
      <svg ref={svgRef} className="w-full h-full min-h-[200px]" />
    </div>
  );
};

export default D3CaesarVisualization;
