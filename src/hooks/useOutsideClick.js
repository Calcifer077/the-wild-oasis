import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  // You can't useEffect conditionally.
  useEffect(
    function () {
      function handleClick(e) {
        // Firslty we check if 'ref.current' exists which is 'StyledModal' in this case.
        // Then we check if 'ref.current' contains 'e.target' that is modal, If it doesn't then the click happened outside and we close the window.
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      // Third argument is about telling whether the event should be captured in the bubbling phase or the capturing phase. If it is set to true, it will be caught in capturing phase when the event is going down the DOM tree.
      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
