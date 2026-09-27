import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import images from "../../images.js";
import "./HomePage.css";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;

  useEffect(() => {
    document.title = "dAIning: RIT";
  }, []);


  const handleRanking = () => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const json_data = JSON.stringify({
          action: "view_todays_ranking",
          timestamp: Date.now() / 1000,
        });
        const response = await fetch("https://us-central1-brickfoodapp.cloudfunctions.net/ranking", {
          method: "POST",
          body: json_data,
        });
        if (response.ok) {
          console.log(response.text);
          const res = await response.json();
          navigate(`/ranking`, {
            state: { data: res.response },
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return (
    <div className="homepage">
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <CircularProgress style={{ color: "#4CAF50" }} />
          </div>
          <Typography
            style={{ color: "white", marginTop: "16px", fontSize: "25px" }}
          >
            Getting the dishes...
          </Typography>
        </div>
      ) : (
        <>
          <p className="motto">when dining hall meets AI</p>
          <img className="tiger" src={images.tiger} />
          <h1 className="app-name">dAIningRIT</h1>
          <Typography
          style={{ 
            marginBottom: "20px", 
            fontWeight: 600, 
            fontSize: "20px", 
          }}
          >Today's date: {formattedDate}</Typography>
          <Container>
            <Link to="/cuisine">
              <StyledButton className="landing-btn">Find your new recipe</StyledButton>
            </Link>
          </Container>

          <Container>
            <StyledButton className="landing-btn" onClick={() => handleRanking()}>
              See others
            </StyledButton>
          </Container>
        </>
      )}
    </div>
  );
};

export default HomePage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const StyledButton = styled.button`
  background-color: #72ea7e;
  border: 2px solid #676460;
  border-radius: 30px;
  box-shadow: #85827f 2px 2px 0 0;
  color: #422800;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  padding: 0 18px;
  line-height: 50px;
  text-align: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: translate(2px, 2px);
  }
`;
