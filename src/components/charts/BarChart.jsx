import React from 'react';
import './BarChart.css';

const BarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);

  return (
    <div className="bar-chart-container">
      <div className="bar-chart" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div key={index} className="bar-item">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${barHeight}%`,
                    background: item.color || 'var(--primary-600)',
                  }}
                  title={`${item.label}: ${item.value}`}
                >
                  <span className="bar-value">{item.value}</span>
                </div>
              </div>
              <div className="bar-label">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;

