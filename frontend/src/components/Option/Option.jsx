import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Option.css";

const CUISINES = [
  "Chinese",
  "Vietnamese",
  "Indian",
  "American",
  "Mexican",
  "Italian",
  "French",
  "Thai",
  "English",
  "Other",
];

const Option = () => {
  const navigate = useNavigate();
  const [pick, setPick] = useState("");
  const [otherOption, setOtherOption] = useState("");

  useEffect(() => {
    document.title = "Choose your cuisine - dAIningRIT";
  }, []);

  const cuisine = (pick === "Other" ? otherOption : pick).trim();

  const handleSubmit = () => {
    navigate("/ingredients", { state: { data: { cuisine } } });
  };

  return (
    <div>
      <p className="prompt">What do you want to eat?</p>

      <div className="list">
        <ul className="grid">
          {CUISINES.map((name) => (
            <li
              key={name}
              className={pick === name ? "picked" : undefined}
              onClick={() => setPick(name)}
            >
              <span>{name}</span>
            </li>
          ))}
        </ul>
        {pick === "Other" && (
          <div className="other-option">
            <input
              type="text"
              placeholder="Enter your option"
              maxLength={60}
              autoFocus
              value={otherOption}
              onChange={(e) => setOtherOption(e.target.value)}
            />
          </div>
        )}
        <div className="button-container">
          <button className="button-74" disabled={!cuisine} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Option;
