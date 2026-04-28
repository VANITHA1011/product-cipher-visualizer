import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const D3ProductCipherVisualization = ({ plaintext, caesarResult, railFenceResult, currentStep, speed }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!plaintext || !caesarResult || !railFenceResult) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svg.node().getBoundingClientRect().width || 600;
    const height = 300;
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    const g = svg.append('g').attr('transform', 'translate(0, 40)');

    const stages = [
      { label: 'Plaintext',          text: plaintext,                    y: 0,   color: '#111827', border: '#d1d5db' },
      { label: 'Caesar (Sub)',        text: caesarResult.ciphertext,      y: 80,  color: '#92400e', border: '#fbbf24' },
      { label: 'Rail Fence (Trans)',  text: railFenceResult.ciphertext,   y: 160, color: '#5b21b6', border: '#a78bfa' },
      { label: 'Ciphertext',          text: railFenceResult.ciphertext,   y: 240, color: '#065f46', border: '#34d399' },
    ];

    stages.forEach((stage, index) => {
      const stageG = g.append('g').attr('transform', `translate(${width / 2}, ${stage.y})`).style('opacity', 0);
      stageG.append('text').attr('y', -15).attr('text-anchor', 'middle').attr('fill', '#6b7280').attr('font-size', '12px').text(stage.label);
      stageG.append('rect').attr('x', -150).attr('y', 0).attr('width', 300).attr('height', 40).attr('rx', 6)
        .attr('fill', '#f9fafb').attr('stroke', stage.border).attr('stroke-width', 2);
      stageG.append('text').attr('y', 25).attr('text-anchor', 'middle').attr('fill', stage.color)
        .attr('font-family', 'monospace').attr('font-size', '16px').attr('font-weight', 'bold')
        .text(stage.text.length > 25 ? stage.text.substring(0, 22) + '...' : stage.text);
      stageG.transition().delay(index * 1000 / speed).duration(500 / speed).style('opacity', 1);

      if (index < stages.length - 1) {
        g.append('path').attr('d', `M ${width / 2} ${stage.y + 40} L ${width / 2} ${stage.y + 80}`)
          .attr('stroke', '#9ca3af').attr('stroke-width', 2).attr('marker-end', 'url(#arrow)')
          .style('opacity', 0).transition().delay((index * 1000 + 500) / speed).duration(500 / speed).style('opacity', 1);
      }
    });

    svg.append('defs').append('marker').attr('id', 'arrow').attr('viewBox', '0 -5 10 10')
      .attr('refX', 8).attr('refY', 0).attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#9ca3af');
  }, [plaintext, caesarResult, railFenceResult, currentStep, speed]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-white rounded-lg">
      <svg ref={svgRef} className="w-full h-full min-h-[300px]" />
    </div>
  );
};

export default D3ProductCipherVisualization;
