import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const D3RailFenceVisualization = ({ railPattern, writeSteps, readSteps, currentStep, railCount, speed }) => {
  const svgRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);
  const [cipherText, setCipherText] = useState('');

  // compute final cipher text from readSteps
  useEffect(() => {
    if (!readSteps || readSteps.length === 0) return;
    const text = readSteps.map(s => s.char).join('');
    setCipherText(text.toUpperCase());
  }, [readSteps]);

  // detect animation finished
  useEffect(() => {
    if (!writeSteps) return;
    setIsFinished(currentStep >= writeSteps.length);
  }, [currentStep, writeSteps]);

  useEffect(() => {
    if (!railPattern || railPattern.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = svg.node().getBoundingClientRect().width || 600;
    const height = Math.max(200, railCount * 40 + 40);
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    const cols = railPattern[0].length;
    const xScale = d3.scaleLinear().domain([0, Math.max(10, cols)]).range([40, width - 40]);
    const yScale = d3.scaleLinear().domain([0, railCount - 1]).range([40, height - 40]);
    const g = svg.append('g');

    for (let i = 0; i < railCount; i++) {
      g.append('line').attr('x1', 20).attr('y1', yScale(i)).attr('x2', width - 20).attr('y2', yScale(i))
        .attr('stroke', '#e5e7eb').attr('stroke-width', 1).attr('stroke-dasharray', '4 4');
    }

    const visibleWriteSteps = writeSteps.slice(0, currentStep + 1);
    const lineGenerator = d3.line().x(d => xScale(d.originalPos)).y(d => yScale(d.rail));

    if (visibleWriteSteps.length > 1) {
      const path = g.append('path').datum(visibleWriteSteps).attr('fill', 'none')
        .attr('stroke', '#06b6d4').attr('stroke-width', 2).attr('stroke-opacity', 0.6).attr('d', lineGenerator);
      const totalLength = path.node().getTotalLength();
      path.attr('stroke-dasharray', totalLength + ' ' + totalLength).attr('stroke-dashoffset', totalLength)
        .transition().duration(500 / speed).ease(d3.easeLinear).attr('stroke-dashoffset', 0);
    }

    g.selectAll('.char').data(visibleWriteSteps).enter().append('text').attr('class', 'char')
      .attr('x', d => xScale(d.originalPos)).attr('y', d => yScale(d.rail)).attr('dy', '0.35em')
      .attr('text-anchor', 'middle').attr('fill', '#7c3aed').attr('font-size', '18px')
      .attr('font-family', 'monospace').attr('font-weight', 'bold').text(d => d.char)
      .style('opacity', 0).transition().duration(300 / speed).style('opacity', 1);
  }, [railPattern, writeSteps, readSteps, currentStep, railCount, speed]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full overflow-hidden bg-white rounded-lg">
        <svg ref={svgRef} className="w-full min-h-[200px]" />
      </div>

      {isFinished && cipherText && (
        <div className="w-full rounded-xl bg-gray-900 border border-gray-700 p-5 text-center animate-fade-in">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-2">
            Final Cipher Text
          </p>
          <p className="text-white font-mono text-3xl font-bold tracking-widest">
            {cipherText}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Row 1 + Row 2 + ... = {cipherText}
          </p>
        </div>
      )}
    </div>
  );
};

export default D3RailFenceVisualization;
