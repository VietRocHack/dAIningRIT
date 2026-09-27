import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export const GreenButton = styled.button`
  background-color: #72ea7e;
  border: 2px solid #676460;
  border-radius: 30px;
  box-shadow: #85827f 2px 2px 0 0;
  color: #422800;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 18px;
  padding: 0 18px;
  line-height: 50px;
  text-align: center;
  transition: transform 0.3s ease;
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  &:active:not(:disabled) {
    transform: translate(2px, 2px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function Loading({ message }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <CircularProgress style={{ color: "#4CAF50" }} />
      <Typography style={{ color: "white", marginTop: "16px", fontSize: "25px" }}>
        {message}
      </Typography>
    </div>
  );
}

export function ErrorMessage({ children }) {
  if (!children) return null;
  return (
    <p role="alert" style={{ color: "#ff8a80", fontWeight: 600, margin: "16px" }}>
      {children}
    </p>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      © {new Date().getFullYear()}{" "}
      <a href="https://vietrochack.com" target="_blank" rel="noreferrer">
        VietRocHack
      </a>{" "}
      ·{" "}
      <a href="https://devpost.com/software/dainingrit" target="_blank" rel="noreferrer">
        Devpost
      </a>
    </footer>
  );
}
