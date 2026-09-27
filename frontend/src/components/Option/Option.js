import React, { useEffect } from "react";
import { useState } from "react";
import "./Option.css";
import { useNavigate } from "react-router-dom";

const Option = () => {
  const navigate = useNavigate();
  const [pick, setPick] = useState("");
  const [otherOption, setOtherOption] = useState("");
  const recipeRequest = {};

  useEffect(() => {
    document.title = "Choose your cuisine - dAIningRIT";
  }, []);

  function handleOnClick(event) {
    setPick(event);
  }

  function handleOtherOptionChange(event) {
    setOtherOption(event.target.value);
  }

  const handleSubmit = () => {
    recipeRequest["cuisine"] = pick;
    console.log(recipeRequest);
    navigate("/ingredients", { state: { data: recipeRequest } });
  }

  return (
    <div>
      <p className="prompt">What do you want to eat?</p>

      <div className="list">
        <ul className="grid">
          <li onClick={() => handleOnClick("Chinese")}>
            <span>Chinese</span>
          </li>
          <li onClick={() => handleOnClick("Vietnamese")}>
            <span>Vietnamese</span>
          </li>
          <li onClick={() => handleOnClick("Indian")}>
            <span>Indian</span>
          </li>
          <li onClick={() => handleOnClick("American")}>
            <span>American</span>
          </li>
          <li onClick={() => handleOnClick("Mexico")}>
            <span>Mexico</span>
          </li>
          <li onClick={() => handleOnClick("Italian")}>
            <span>Italian</span>
          </li>
          <li onClick={() => handleOnClick("French")}>
            <span>French</span>
          </li>
          <li onClick={() => handleOnClick("Thailand")}>
            <span>Thailand</span>
          </li>
          <li onClick={() => handleOnClick("England")}>
            <span>England</span>
          </li>
          <li onClick={() => handleOnClick("Other")}>
            <span>Other</span>
          </li>
        </ul>
        {pick === "Other" && (
          <div className="other-option">
            <input
              type="text"
              placeholder="Enter your option"
              value={otherOption}
              onChange={handleOtherOptionChange}
            />
          </div>
        )}
        <div className="button container">
          <button className="button-74" onClick={() => handleSubmit()}> Submit </button>
        </div>
      </div>
      {/* <div className="test">
        You picked {pick === "Other" ? otherOption : pick}
      </div> */}
    </div>
  );
};

export default Option;
