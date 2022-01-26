import React, { useState } from 'react';
import MouseLeft from './mouse-images/mouse-left-button.png';
import MouseMiddle from './mouse-images/mouse-middle-button.png';
import MouseRight from './mouse-images/mouse-right-button.png';
import { Popover } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import './InstructionsPopover.scss';

const Instructions = () => {
  const instructions: IInstructionRowProps[] = [
    { image: MouseLeft, text: 'Drag to move the camera' },
    { image: MouseMiddle, text: 'Scroll to zoom in and out' },
    { image: MouseRight, text: 'Drag to rotate the camera' },
  ];

  return (
    <div className="instructions">
      <span className="instruction-preface">On the main canvas...</span>
      {instructions.map((props, i) => (
        <InstructionRow key={i} {...props} />
      ))}
    </div>
  );
};

interface IInstructionRowProps {
  image: string;
  text: string;
}

const InstructionRow = ({ image, text }: IInstructionRowProps) => {
  return (
    <div className="instruction-row">
      <span className="instruction-text">{text}</span>
      <img src={image} className="instruction-image" />
    </div>
  );
};

const InstructionsPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div id="InstructionsIcon" onClick={handlePopoverOpen}>
        <InfoIcon fontSize="large" />
      </div>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableRestoreFocus
      >
        <Instructions />
      </Popover>
    </>
  );
};

export default InstructionsPopover;
