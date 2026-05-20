import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Popups, updatePopup } from "../../redux/actions/popupsActions";

import { getVimeoPopupIsOpen } from "../../redux/reducers/popupsReducer";

const VimeoPopup = () => {
  const isVimeoPopupVisible = useSelector(getVimeoPopupIsOpen);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(updatePopup({ popup: Popups.vimeoPopup, status: false }));
  };

  return (
    <Wrapper className={isVimeoPopupVisible ? "active" : ""}>
      <div className="wrapper">
        <iframe
          title="vimeo-player"
          src="https://player.vimeo.com/video/804116995?h=aabd06abd3"
          allowFullScreen
        ></iframe>
        <div onClick={handleClose}>
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M777.856 280.192l-33.92-33.952-231.872 231.872-231.84-231.872-33.984 33.888 231.872 231.904-231.84 231.84 33.888 33.984 231.904-231.904 231.84 231.872 33.952-33.888-231.872-231.904z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
      <Darkener onClick={handleClose} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: none;

  &.active {
    opacity: 1;
    display: block;
  }

  .wrapper {
    width: 900px;
    max-width: 100%;
    padding-top: 30%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;

    @media (max-width: 1300px) {
      width: 830px;
    }

    @media (max-width: 600px) {
      padding-top: 45%;
    }
  }

  svg {
    width: 90px;
    position: absolute;
    top: -105px;
    right: -120px;
    height: auto;
    z-index: 30;
    cursor: pointer;

    @media (max-width: 1300px) {
      width: 70px;
      top: -60px;
      right: -50px;
    }

    @media (max-width: 1100px) {
      right: 30px;
    }

    @media (max-width: 600px) {
      width: 50px;
      right: 0;
    }
  }

  iframe {
    position: absolute;
    z-index: 20;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: none;
    border-radius: 10px;
    @media (max-width: 600px) {
      width: 90%;
      margin-left: 5%;
    }
  }
`;

const Darkener = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #000;
  opacity: 0.8;
`;

export default VimeoPopup;
