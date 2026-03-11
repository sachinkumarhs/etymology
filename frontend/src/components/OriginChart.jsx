import React from 'react';
import { ArrowRight } from 'lucide-react';
import './OriginChart.css';

const OriginChart = ({ treeData }) => {
  if (!treeData || treeData.length === 0) return null;

  // Sorting nodes based on parentId relationship to ensure chronological order
  const sortedNodes = [];
  const visited = new Set();
  
  // Find root (node without parentId)
  let current = treeData.find(node => !node.parentId);
  
  while (current && !visited.has(current.id)) {
    sortedNodes.push(current);
    visited.add(current.id);
    // Find the child node whose parentId is our current node's id
    const nextNode = treeData.find(node => node.parentId === current.id && !visited.has(node.id));
    current = nextNode;
  }

  // If sorting fails for any reason, fallback to original order
  const displayNodes = sortedNodes.length > 0 ? sortedNodes : treeData;

  return (
    <div className="glass-panel chart-container animate-fade-in">
      <h3 className="chart-title">Linguistic Evolution Timeline</h3>
      <div className="timeline-wrapper">
        <div className="timeline-grid">
          {displayNodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div className="timeline-node glass-panel">
                <span className="node-lang">{node.language}</span>
                <span className="node-label">{node.label}</span>
              </div>
              {index < displayNodes.length - 1 && (
                <div className="timeline-arrow">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="timeline-hint">Tracing the journey from ancient roots to the modern word.</p>
    </div>
  );
};

export default OriginChart;
