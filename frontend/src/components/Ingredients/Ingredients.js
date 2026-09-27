import React, { useEffect } from "react";
import "./Ingredients.css";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Ingredients = (props) => {
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



  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listInput, setListInput] = useState([]);
  const [input, setInput] = useState("");

  const { state } = useLocation();

  const recipeRequest = state.data;

  useEffect(() => {
    document.title = "Choose your ingredients - dAIningRIT";
  }, []);

  const handleAdd = () => {
    if (input.trim() !== "") {
      setListInput([...listInput, input]);
      setInput("");
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleDelete = (i) => {
    const newList = listInput.filter((value, index) => index !== i);
    setListInput(newList);
  };

  const handleSubmit = () => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const json_data = JSON.stringify({
          cuisine: recipeRequest["cuisine"],
          ingrs: listInput
        });
        const response = await fetch("https://us-central1-brickfoodapp.cloudfunctions.net/find_recipe", {
          method: "POST",
          body: json_data,
        });
        if (response.ok) {
          //   console.log(response.text);
          const res = await response.json();
          navigate(`/card/${res.response.id}`, { state: { data: res.response } });
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
    <div className="box">
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
          <Typography style={{ color: "white", marginTop: "16px", fontSize: "25px" }}>
            Generating your recipe...
          </Typography>
        </div>
      ) : (
        <>
          <nav className="question">Choose your ingredients:</nav>

          <form className="form-ingres" style={{ display: "flex", justifyContent: "space-around" }}>
            {/* DropDown Input */}
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '100%' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Ingredients"
                variant="outlined"
                onChange={(e) => handleChange(e)}
                value={input}
                sx={{
                  '& label': {
                    color: 'whitesmoke', // Set the label color
                  },
                  '& input': {
                    color: 'whitesmoke', // Set the input text color
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333', // Set the border color
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#555', // Set the border color on hover
                  },
                }}
              />
            </Box>
            <StyledButton
              variant="contained"
              onClick={() => handleAdd()}
            >
              Add
            </StyledButton>
          </form>

          <ul className="ingredients">
            {listInput.length === 0 ? (
              <li className="ingre">No ingredients yet!</li>
            ) : (
              listInput.map((ingredient, index) => (
                <li className="ingre" key={index}>
                  <label className="label">
                    <span>{ingredient}</span>
                  </label>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>

          <StyledButton
            variant="contained"
            onClick={() => handleSubmit()}
          >
            Submit
          </StyledButton>

          {/* <p>List of ingrs you picked are {listInput}</p> */}
        </>
      )}
    </div>
  );
};

export default Ingredients;