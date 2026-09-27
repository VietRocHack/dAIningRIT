import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

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

export default function RecipeReviewCard(props) {
  const [liked, setLiked] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const { state } = useLocation();
  const [likeCount,setLikeCount] = React.useState(() => state.data.voteCount)


  useEffect(() => {
    document.title = state.data.foodName + " - dAIningRIT";
  }, [state]);

  const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    position: "relative",
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClick = () => {
    const newLiked = !liked
    setLiked(newLiked);
    Cookies.set(`like_${state.data.id}`, !liked, { expires: 7 });
    setLikeCount(
      (prev) => newLiked ? prev + 1 : prev - 1 
    )
  };

  const convertTimestampToDate = (timestamp) => {
    const timestampInMilliseconds = timestamp * 1000;
    const date = new Date(timestampInMilliseconds);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  React.useEffect(() => {
    const likeStatus = Cookies.get(`like_${state.data.id}`);
    if (likeStatus === "true") {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [state.data.id]);

  return (
    <Container>
      <ButtonContainer variant="contained">
        <Link to="/">
          <ArrowBackIcon
            sx={{ fontSize: 40, color: "white", marginY: "18px" }}
          />
        </Link>
      </ButtonContainer>
      <Typography variant="h3" align="center" gutterBottom>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "45px",
            color: "white",
          }}
        >
          Result!
        </span>
      </Typography>
      <Card
        sx={{
          width: 370,
          minHeight: 750,
          borderRadius: 10,
          backgroundColor: "#d1cdcd",
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="h2"
              style={{ fontSize: "25px", padding: "5px" }}
            >
              <strong>{state.data.foodName}</strong>
            </Typography>
          }
          subheader={convertTimestampToDate(state.data.timestamp)}
        />
        <CardMedia
          component="img"
          height="194"
          image={state.data.imageUrl}
          alt="Something has to appear here"
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
          {state.data.ingrs.map((element) => (
            <div key={element.name}>
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
          <IconButton aria-label="add to favorites" onClick={handleClick}>
            {liked ? (
              <FavoriteIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Typography>{likeCount}</Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {!expanded ? <Typography>RECIPE</Typography> : <></>}
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="h3" align="left" gutterBottom>
              <span style={{ fontWeight: "bold", fontSize: "30px" }}>
                RECIPE
              </span>
            </Typography>
            {state.data.recipe.map((element, index) => (
              <Typography key={element}>
                <span style={{ marginRight: "8px" }}>
                  &bull; Step {index + 1}:
                </span>
                {element}
              </Typography>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </Container>
  );
}
