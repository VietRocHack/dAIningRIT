import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import tiger from "../../assets/tiger1.png";
import { getTodaysRanking } from "../../api";
import { ErrorMessage, Loading } from "../common";
import "./Ranking.css";

const Ranking = () => {
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Others' Recipes - dAIningRIT";
    getTodaysRanking()
      .then(setList)
      .catch((err) => setError(err.message));
  }, []);

  if (!list && !error) return <Loading message="Getting the dishes..." />;

  return (
    <div className="ranking-page">
      <Link to="/" className="back-link" aria-label="Back to home">
        <ArrowBackIcon sx={{ fontSize: 40, color: "white" }} />
      </Link>
      <nav className="nav-bar">Others' Recipes</nav>

      <ErrorMessage>{error}</ErrorMessage>
      {list?.length === 0 && (
        <p className="empty">No recipes yet today. Be the first!</p>
      )}

      <div className="ranking-list">
        <ul className="posts">
          {list?.map((element) => (
            <li
              className="post"
              key={element.id}
              onClick={() => navigate(`/card/${element.id}`, { state: { data: element } })}
            >
              <img
                className={element.imageUrl ? "ranking-images" : "ranking-images placeholder"}
                alt={element.foodName}
                src={element.imageUrl || tiger}
              />
              <footer className="ranking-footer">
                <span className="foodname">{element.foodName}</span>
                <div className="vote">
                  <span className="vote-numbers">{element.voteCount}</span>
                  <FavoriteIcon />
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Ranking;
