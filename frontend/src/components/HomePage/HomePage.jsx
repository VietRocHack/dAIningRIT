import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Typography } from "@mui/material";
import tiger from "../../assets/tiger1.png";
import { GreenButton } from "../common";
import "./HomePage.css";

const HomePage = () => {
  const today = new Date();
  const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  useEffect(() => {
    document.title = "dAIning: RIT";
  }, []);

  return (
    <div className="homepage">
      <p className="motto">when dining hall meets AI</p>
      <img className="tiger" src={tiger} alt="RIT tiger mascot" />
      <h1 className="app-name">dAIningRIT</h1>
      <Typography style={{ marginBottom: "20px", fontWeight: 600, fontSize: "20px" }}>
        Today's date: {formattedDate}
      </Typography>
      <Container>
        <Link to="/cuisine">
          <GreenButton className="landing-btn">Find your new recipe</GreenButton>
        </Link>
      </Container>
      <Container>
        <Link to="/ranking">
          <GreenButton className="landing-btn">See others</GreenButton>
        </Link>
      </Container>
    </div>
  );
};

export default HomePage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;
