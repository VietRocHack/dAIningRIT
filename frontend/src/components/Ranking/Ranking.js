import React, { useState, useEffect } from "react";
import "./Ranking.css";
import images from "../../images.js";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate, useLocation } from "react-router-dom";

const Ranking = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const { state } = useLocation();
  console.log(state.data);

  const handleCard = (element) => {
    navigate(`/card/${element.id}`, { state: { data: element } });
  };

  useEffect(() => {
    document.title = "Others' Recipe - dAIningRIT";
  }, []);

  React.useEffect(() => {
    setList(state.data);
  }, [state]);

  return (
    <div className="ranking-page">
      <nav className="nav-bar">Other's Recipes</nav>

      <div className="ranking-list">
        <ul className="posts">
          {list.map((element, index) => {
            return (
              <li
                className="post"
                key={index}
                onClick={() => handleCard(element)}
              >
                <img
                  className="ranking-images"
                  alt="foodImage"
                  src={element.imageUrl}
                />
                <footer className="ranking-footer">
                  <span className="foodname">{element.foodName}</span>
                  <div className="vote">
                    <span className="vote-numbers">{element.voteCount}</span>
                    <FavoriteIcon />
                  </div>
                </footer>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Ranking;
