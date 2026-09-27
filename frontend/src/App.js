import "./App.css";
import * as React from "react";
import RecipeReviewCard from "./components/Card/Card";
import Option from "./components/Option/Option";
import HomePage from "./components/HomePage/HomePage";
import Ingredients from "./components/Ingredients/Ingredients";
import Ranking from "./components/Ranking/Ranking";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ingredients" element={<Ingredients />} />
      <Route path="/cuisine" element={<Option />} />
      <Route path="/card/:id" element={<RecipeReviewCard />} />
      <Route path="/ranking" element={<Ranking />} />
    </Routes>
  );
}

export default App;
