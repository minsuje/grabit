import _ from 'lodash';
import React from 'react';

interface SeparatorProps {
  turns: number;
  style?: React.CSSProperties;
}

const Separator: React.FC<SeparatorProps> = ({ turns, style }) => (
  <div
    style={{
      position: 'absolute',
      height: '100%',
      transform: `rotate(${turns}turn)`,
    }}
  >
    <div style={style} />
  </div>
);

interface RadialSeparatorsProps {
  count: number;
  style?: React.CSSProperties;
}

const RadialSeparators: React.FC<RadialSeparatorsProps> = ({ count, style }) => {
  const turns = 1 / count;
  return (
    <>
      {_.range(count).map((index) => (
        <Separator key={index} turns={index * turns} style={style} />
      ))}
    </>
  );
};

export default RadialSeparators;
