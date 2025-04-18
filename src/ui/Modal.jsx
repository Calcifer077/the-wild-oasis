import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

// refer to 'Converting the modal to a compound component'

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

// Basically 'Open' recieves a 'Button' and name of what to open. We want to attach a event handler to this button but we are recieving this as a children. So we will clone this element and attach 'onClick' event handler to it.
function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  // 'cloneElement' lets you create a new React element using another element as a starting point
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  // const ref = useRef();

  // // You can't useEffect conditionally.
  // useEffect(
  //   function () {
  //     function handleClick(e) {
  //       // Firslty we check if 'ref.current' exists which is 'StyledModal' in this case.
  //       // Then we check if 'ref.current' contains 'e.target' that is modal, If it doesn't then the click happened outside and we close the window.
  //       if (ref.current && !ref.current.contains(e.target)) {
  //         close();
  //       }
  //     }

  //     // Third argument is about telling whether the event should be captured in the bubbling phase or the capturing phase. If it is set to true, it will be caught in capturing phase when the event is going down the DOM tree.
  //     document.addEventListener("click", handleClick, true);

  //     return () => document.removeEventListener("click", handleClick, true);
  //   },
  //   [close]
  // );

  const ref = useOutsideClick(close);

  // Each modal has a associated 'name' with it. So if the 'openName' and 'name' are different then don't render anything.
  // 'openName' is the one that was supposed to open after clicking on the button, but 'name' is the one that we have to open, which is passed in this component. 'openName' comes from Context.
  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
