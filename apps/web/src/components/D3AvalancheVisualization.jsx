import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const D3AvalancheVisualization = ({ text1, text2, differences, percentage, diffPositions }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!text1 || !text2) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svg.node().getBoundingClientRect().width || 600;
    const height = 150;
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    const maxLength = Math.max(text1.length, text2.length);
    const xScale = d3.scaleLinear().domain([0, Math.max(10, maxLength)]).range([40, width - 40]);
    const g = svg.append('g').attr('transform', 'translate(0, 40)');

    g.append('text').attr('x', 10).attr('y', 0).attr('fill', '#6b7280').attr('font-size', '12px').text('Original:');
    g.selectAll('.t1').data(text1.split('')).enter().append('text')
      .attr('x', (d, i) => xScale(i)).attr('y', 20).attr('text-anchor', 'middle')
      .attr('fill', '#111827').attr('font-family', 'monospace').text(d => d);

    g.append('text').attr('x', 10).attr('y', 50).attr('fill', '#6b7280').attr('font-size', '12px').text('Modified:');
    g.selectAll('.t2').data(text2.split('')).enter().append('text')
      .attr('x', (d, i) => xScale(i)).attr('y', 70).attr('text-anchor', 'middle')
      .attr('fill', (d, i) => diffPositions.includes(i) ? '#ef4444' : '#111827')
      .attr('font-family', 'monospace')
      .attr('font-weight', (d, i) => diffPositions.includes(i) ? 'bold' : 'normal')
      .text(d => d).style('opacity', 0)
      .transition().delay((d, i) => i * 50).duration(300).style('opacity', 1);

    g.append('text').attr('x', width / 2).attr('y', 110).attr('text-anchor', 'middle')
      .attr('fill', '#ef4444').attr('font-size', '14px').attr('font-weight', 'bold')
      .text(`Avalanche Effect: ${percentage}% changed (${differences} chars)`)
      .style('opacity', 0).transition().delay(maxLength * 50 + 300).duration(500).style('opacity', 1);
  }, [text1, text2, differences, percentage, diffPositions]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-white rounded-lg">
      <svg ref={svgRef} className="w-full h-full min-h-[150px]" />
    </div>
  );
};

export default D3AvalancheVisualization;
