import React from 'react';
import './Spacer.scss';

interface ISpacerProps {
  double?: boolean;
}

const Spacer = ({ double }: ISpacerProps) => {
  return <div className={'spacer ' + (double ? 'double' : '')} />;
};

export default Spacer;
