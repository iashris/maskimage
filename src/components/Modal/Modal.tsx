import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../common';

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #00000066;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: scroll;
`;

const ModalBody = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
`;

interface ICoordinate {
  x: number;
  y: number;
}

interface IMask {
  loc: ICoordinate;
  width: number;
  height: number;
}

const Modal: React.FC<{
  img: HTMLImageElement | undefined;
  closeModal: () => void;
}> = ({ img, closeModal }) => {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
  const [mouseDown, setMouseDown] = useState<Boolean>(false);
  const [lastMousePosition, setLastMousePosition] = useState<ICoordinate>();
  const [lastMask, setLastMask] = useState<IMask>();

  let imgh = 600,
    imgw = 400;

  if (img) {
    imgh = img.height;
    imgw = img.width;
  }

  const getLocalCoordinates = (event: React.MouseEvent) => {
    const canvasObj = canvasRef.current;
    if (!canvasObj) return;
    const rect = canvasObj.getBoundingClientRect();
    const scaleX = canvasObj.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvasObj.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const downloadImage = function () {
    const canvasObj = canvasRef.current;
    var link = document.createElement('a');
    link.download = 'filename.png';
    if (canvasObj) {
      link.href = canvasObj.toDataURL();
      link.click();
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setLastMousePosition(getLocalCoordinates(event));
    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const currMouse = getLocalCoordinates(event);
    if (mouseDown && currMouse && lastMousePosition) {
      const width = currMouse.x - lastMousePosition.x;
      const height = currMouse.y - lastMousePosition.y;

      setLastMask({ loc: lastMousePosition, width, height });
    }
  };

  useEffect(() => {
    const canvasObj = canvasRef.current;
    const ctx = canvasObj?.getContext('2d');
    // clear the canvas area before rendering the coordinates held in state

    if (!canvasObj) return;
    ctx?.clearRect(0, 0, canvasObj.width, canvasObj.height);
    const rect = canvasObj.getBoundingClientRect();
    const scaleX = canvasObj.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvasObj.height / rect.height;

    img && console.log(img.width, img.height);

    if (img)
      ctx?.drawImage(img, 0, 0, 600 * scaleX, (600 * imgh * scaleY) / imgw);

    if (lastMask && ctx) {
      ctx.beginPath();
      ctx.rect(lastMask.loc.x, lastMask.loc.y, lastMask.width, lastMask.height);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  });

  return (
    <ModalWrapper>
      <ModalBody>
        <div>
          <canvas
            className='App-canvas'
            ref={canvasRef}
            width={600}
            height={(600 * imgh) / imgw}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
          />
        </div>
        <div>
          <Button onClick={downloadImage}>Download</Button>
          <Button onClick={closeModal}>Close</Button>
        </div>
      </ModalBody>
    </ModalWrapper>
  );
};

export default Modal;
