import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { findRecipe } from "../../api";
import { ErrorMessage, GreenButton, Loading } from "../common";
import "./Ingredients.css";

const MAX_INGREDIENTS = 15;

const Ingredients = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listInput, setListInput] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    document.title = "Choose your ingredients - dAIningRIT";
  }, []);

  const cuisine = state?.data?.cuisine;
  if (!cuisine) return <Navigate to="/cuisine" replace />;

  const handleAdd = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (value && listInput.length < MAX_INGREDIENTS) {
      setListInput([...listInput, value]);
      setInput("");
    }
  };

  const handleDelete = (i) => {
    setListInput(listInput.filter((_, index) => index !== i));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const recipe = await findRecipe(cuisine, listInput);
      navigate(`/card/${recipe.id}`, { state: { data: recipe } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Generating your recipe..." />;

  return (
    <div className="box">
      <nav className="question">Choose your {cuisine} ingredients:</nav>

      <form className="form-ingres" onSubmit={handleAdd}>
        <TextField
          label="Ingredients"
          variant="outlined"
          autoComplete="off"
          inputProps={{ maxLength: 60 }}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          sx={{
            flex: 1,
            m: 1,
            "& label": { color: "whitesmoke" },
            "& input": { color: "whitesmoke" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#333" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
          }}
        />
        <GreenButton
          type="submit"
          style={{ margin: 8 }}
          disabled={!input.trim() || listInput.length >= MAX_INGREDIENTS}
        >
          Add
        </GreenButton>
      </form>

      <ul className="ingredients">
        {listInput.length === 0 ? (
          <li className="ingre">No ingredients yet! (Optional: we'll pick for you.)</li>
        ) : (
          listInput.map((ingredient, index) => (
            <li className="ingre" key={index}>
              <label className="label">
                <span>{ingredient}</span>
              </label>
              <button className="btn btn-danger" onClick={() => handleDelete(index)}>
                Delete
              </button>
            </li>
          ))
        )}
      </ul>

      <ErrorMessage>{error}</ErrorMessage>

      <GreenButton onClick={handleSubmit}>Submit</GreenButton>
    </div>
  );
};

export default Ingredients;
