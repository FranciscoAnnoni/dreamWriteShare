import React from 'react';

interface BoxProps {
  children: React.ReactNode;
  sx?: React.CSSProperties;
  className?: string;
}

const Box: React.FC<BoxProps> = ({
  children,
  sx = {},
  className = ''
}) => {
  return (
    <div className={className} style={sx}>
      {children}
    </div>
  );
};

export default Box;
