import { Global, css } from "@emotion/react";

const globalStyles = css`
  :root {
    --bg-color: #061118;
    --text-color: #b6e5ea;
    --soft-text-color: #409caa;
    --primary-color: #86d0db;
    --secondary-color: #063440;
    --hover-color: #094251;
    --transition-speed: 0.5s;
    --joy-color: #3a3a0a;
    --sadness-color: #1a3a4a;
    --anger-color: #3a1a1a;
    --fear-color: #2a1a3a;
    --neutral-color: #061118;
  }

  body {
    font-family: "Roboto", sans-serif;
    background: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    transition: background 1s ease, color 1s ease;
  }

  /* Webkit browsers (Chrome, Safari, newer versions of Opera) */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--secondary-color);
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--hover-color);
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) var(--secondary-color);
  }

  /* For Internet Explorer and Edge */
  body {
    -ms-overflow-style: none;
  }

  .particle {
    position: absolute;
    background-color: var(--primary-color);
    border-radius: 50%;
    opacity: 0.3;
    animation: float 15s infinite ease-in-out;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-20px) translateX(20px);
    }
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;
