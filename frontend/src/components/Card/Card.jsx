import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from "js-cookie";
import tiger from "../../assets/tiger1.png";
import { getRecipe, likeRecipe } from "../../api";
import { ErrorMessage, Loading } from "../common";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  position: "relative",
  padding: "0 16px",
});

const ButtonContainer = styled("div")({
  position: "absolute",
  top: "10px",
  left: "30px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.3)",
  },
  cursor: "pointer",
});

const convertTimestampToDate = (timestamp) => new Date(timestamp * 1000).toLocaleString();

export default function RecipeReviewCard() {
  const { id } = useParams();
  const { state } = useLocation();
  const [recipe, setRecipe] = useState(state?.data?.id === id ? state.data : null);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(() => Cookies.get(`like_${id}`) === "true");
  const [likeCount, setLikeCount] = useState(recipe?.voteCount ?? 0);
  const [expanded, setExpanded] = useState(false);

  // Router state survives reloads, so it can hold a stale voteCount; always refresh.
  useEffect(() => {
    getRecipe(id)
      .then((data) => {
        setRecipe(data);
        setLikeCount(data.voteCount ?? 0);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (recipe) document.title = `${recipe.foodName} - dAIningRIT`;
  }, [recipe]);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
    try {
      const { voteCount } = await likeRecipe(id, newLiked);
      Cookies.set(`like_${id}`, String(newLiked), { expires: 7 });
      setLikeCount(voteCount);
    } catch {
      setLiked(!newLiked);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
    }
  };

  const backButton = (
    <ButtonContainer>
      <Link to="/" aria-label="Back to home">
        <ArrowBackIcon sx={{ fontSize: 40, color: "white", marginY: "18px" }} />
      </Link>
    </ButtonContainer>
  );

  if (error) {
    return (
      <Container>
        {backButton}
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }
  if (!recipe) return <Loading message="Getting the dish..." />;

  return (
    <Container>
      {backButton}
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 10 }}>
        <span style={{ fontWeight: "bold", fontSize: "45px", color: "white" }}>Result!</span>
      </Typography>
      <Card
        sx={{
          width: "100%",
          maxWidth: 370,
          minHeight: 750,
          borderRadius: 10,
          backgroundColor: "#d1cdcd",
          mb: 4,
        }}
      >
        <CardHeader
          title={
            <Typography variant="h2" style={{ fontSize: "25px", padding: "5px" }}>
              <strong>{recipe.foodName}</strong>
            </Typography>
          }
          subheader={convertTimestampToDate(recipe.timestamp)}
        />
        <CardMedia
          component="img"
          height="194"
          image={recipe.imageUrl || tiger}
          sx={recipe.imageUrl ? undefined : { objectFit: "contain" }}
          alt={recipe.foodName}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="bold"
            fontSize="25px"
            margin="10px"
          >
            How to get it?
          </Typography>
          {recipe.ingrs.map((element) => (
            <div key={`${element.name}-${element.station}`}>
              <Typography variant="h6">
                <span style={{ marginRight: "8px" }}>&bull;</span>
                <strong>{element.name}</strong>
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                &nbsp;&nbsp;&nbsp; <strong>{element.station} station</strong>
              </Typography>
            </div>
          ))}
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label={liked ? "unlike" : "like"} onClick={handleLike}>
            {liked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography>{likeCount}</Typography>
          <ExpandMore
            expand={expanded}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show recipe"
          >
            {!expanded && <Typography>RECIPE</Typography>}
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="h3" align="left" gutterBottom>
              <span style={{ fontWeight: "bold", fontSize: "30px" }}>RECIPE</span>
            </Typography>
            {recipe.recipe.map((element, index) => (
              <Typography key={index}>
                <span style={{ marginRight: "8px" }}>&bull; Step {index + 1}:</span>
                {element}
              </Typography>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </Container>
  );
}
