import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import RecipeReviewCard from "./components/Card/Card";
import Option from "./components/Option/Option";
import HomePage from "./components/HomePage/HomePage";
import Ingredients from "./components/Ingredients/Ingredients";
import Ranking from "./components/Ranking/Ranking";
import { Footer } from "./components/common";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/cuisine" element={<Option />} />
          <Route path="/card/:id" element={<RecipeReviewCard />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
