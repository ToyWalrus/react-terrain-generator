import React, { useEffect, useState } from 'react';
import MouseLeft from './mouse-images/mouse-left-button.png';
import MouseMiddle from './mouse-images/mouse-middle-button.png';
import MouseRight from './mouse-images/mouse-right-button.png';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import classNames from 'classnames';
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
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [popoverRect, setPopoverRect] = useState<DOMRect | null>(null);
  const [isPinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);

  const anchorNeedsSetting = anchorRect === null;
  const popoverNeedsSetting = popoverRect === null;

  useEffect(() => {
    const onResize = () => {
      setAnchorRect(null);
      setPopoverRect(null);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const closedStyle = {
    opacity: 0,
    left: (anchorRect?.left || 0) - (popoverRect?.width || 0),
    top: anchorRect?.bottom || 0,
    transform: 'scale(0)',
  };

  const openStyle = {
    ...closedStyle,
    opacity: 1,
    transform: 'scale(1)',
  };

  const setRectByRef = (needsSetting: boolean, setFn: (d: DOMRect) => void) => {
    return (r: HTMLDivElement | null) => {
      if (needsSetting) {
        const rect = r?.getBoundingClientRect();
        if (rect) {
          setFn(rect);
        }
      }
    };
  };

  return (
    <>
      <div
        id="InstructionsIcon"
        className={classNames({
          pinned: isPinned,
        })}
        onMouseOver={() => setOpen(true)}
        onMouseLeave={() => {
          if (!isPinned) setOpen(false);
        }}
        onClick={() => setPinned(p => !p)}
        ref={setRectByRef(anchorNeedsSetting, setAnchorRect)}
      >
        <InfoIcon fontSize="large" />
      </div>
      <div
        id="InstructionsPopover"
        className={classNames({
          pinned: isPinned,
        })}
        ref={setRectByRef(popoverNeedsSetting, setPopoverRect)}
        style={popoverNeedsSetting ? { top: -1000 } : open ? openStyle : closedStyle}
      >
        <Instructions />
      </div>
    </>
  );
};

export default InstructionsPopover;
