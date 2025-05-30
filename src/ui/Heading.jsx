import styled, { css } from "styled-components";

// const test = `text-align: center;`;
// const test = css`
//   text-align: center;
// `;

// As below is a regular template we can add JS in it.
const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      /* background-color: yellow; */
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
      /* background-color: yellow; */
    `}

    ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
      /* background-color: yellow; */
    `} 

    ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: 500;
      text-align: center;
    `} 
    line-height: 1.4;
`;

export default Heading;
