import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal/Modal';
import sample from '../../sample.png';
import { Button } from '../../common';

const Wrapper = styled.div`
  background-color: #00000011;
  padding: 12px;
  border-radius: 8px;
`;

const MaskModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [img, setImg] = useState<HTMLImageElement>();
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    hiddenFileInput?.current?.click();
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded: any = event.target.files?.[0];
    var fr = new FileReader();
    fr.onload = function (e) {
      const img = new Image();
      img.onload = function (ev) {
        setImg(img);
        console.log(img);
        setIsOpen(true);
      };
      if (e.target?.result) {
        img.src = e.target?.result as string;
      }
    };
    fr.readAsDataURL(fileUploaded);
  };

  const useSample = () => {
    const sampleImg = new Image();
    sampleImg.onload = () => {
      setImg(sampleImg);
      setIsOpen(true);
    };
    sampleImg.src = sample;
  };

  if (!isOpen) {
    return (
      <Wrapper>
        <input
          type='file'
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <Button onClick={useSample}>Use Sample</Button>
        <Button onClick={handleClick}>Upload Image</Button>
      </Wrapper>
    );
  }
  return <Modal closeModal={closeModal} img={img}></Modal>;
};

export default MaskModal;
