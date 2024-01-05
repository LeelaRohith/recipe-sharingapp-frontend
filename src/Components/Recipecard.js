import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { TailSpin } from "react-loader-spinner";
import CardContent from "@mui/material/CardContent";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import Stack from "@mui/material/Stack";

import { useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import axios from "axios";

import CloseIcon from "@mui/icons-material/Close";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function RecipeReviewCard(props) {
  // const [open, setOpen] = React.useState(false);
  // const [imageData, setImageData] = useState(null);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props.userfirstname.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={props.details.name}
        subheader={props.userfirstname + " " + props.userlastname}
      />
      {props.image == null ? null : (
        // <TailSpin
        //   visible={true}
        //   height="30"
        //   width="30"
        //   color="#1976D2"
        //   ariaLabel="tail-spin-loading"
        //   radius="1"
        //   wrapperStyle={{}}
        //   wrapperClass=""
        // />
        <CardMedia
          component="img"
          height="194"
          image={props.image}
          alt="Recipe image"
        />
      )}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.details.description}
        </Typography>
        <br></br>
        {props.type === "view" ? (
          <Viewrecipe
            details={props.details}
            userfirstname={props.userfirstname}
            userlastname={props.userlastname}
          ></Viewrecipe>
        ) : (
          <Editform
            details={props.details}
            userfirstname={props.userfirstname}
            userlastname={props.userlastname}
            image={props.image}
            userid={props.userid}
            setRecipedetails={props.setRecipedetails}
            recipedetails={props.recipedetails}
          ></Editform>
        )}
      </CardContent>
    </Card>
  );
}
function Editform(props) {
  const [deletenotification, setDeletenotification] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const editedIngredients = [];
  props.details.ingredients.forEach(function (item) {
    editedIngredients.push(item.ingredient);
  });
  const [ingredients, setIngredients] = React.useState(editedIngredients);
  const [newingredient, setNewingredient] = React.useState("");
  // const [imagename, setImagename] = React.useState("");

  const headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteOpen = () => {
    setDeletenotification(true);
  };

  const handleDeleteClose = () => {
    setDeletenotification(false);
  };

  const handleDelete = (ingredient) => {
    setIngredients(ingredients.filter((x) => x !== ingredient));
    //console.log(ingredient);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const userEnteredRecipe = {
      id: props.details.id,
      name: data.get("name"),
      date: props.details.date,
      description: data.get("description"),
      cookingInstructions: data.get("cookinginstructions"),
      image: props.details.image,
    };

    try {
      const response = await axios.put(
        "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user/editrecipe/" +
          props.userid,
        userEnteredRecipe,
        { headers }
      );

      const editingredientsResponse = await axios.put(
        "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user/editingredients/" +
          response.data.text,
        { ingredients: ingredients },
        { headers }
      );
      console.log(editingredientsResponse.data);
      enqueueSnackbar("Recipe updated successfully", {
        variant: "success",
        autoHideDuration: 5000,
      });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Internal Server Error", {
        variant: "error",
        autoHideDuration: 5000,
      });
      setLoading(false);
    }
    props.setRecipedetails((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === userEnteredRecipe.id
          ? { ...recipe, name: userEnteredRecipe.name }
          : recipe
      )
    );
    props.setRecipedetails((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === userEnteredRecipe.id
          ? { ...recipe, description: userEnteredRecipe.description }
          : recipe
      )
    );
    props.setRecipedetails((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === userEnteredRecipe.id
          ? {
              ...recipe,
              cookingInstructions: userEnteredRecipe.cookingInstructions,
            }
          : recipe
      )
    );
    setOpen(false);
  };
  const handleDeleterecipe = async (event) => {
    const response = await axios.post(
      "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user/delete",
      { id: props.details.id },
      { headers }
    );
    console.log(response.data);
    const r = props.recipedetails.filter(
      (item) => item.id !== props.details.id
    );
    props.setRecipedetails(r);

    enqueueSnackbar(props.details.name + " Recipe Deleted Successfully", {
      variant: "success",
      autoHideDuration: 5000,
    });
    setDeletenotification(false);
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          style={{ marginRight: "15px" }}
          variant="contained"
          onClick={handleClickOpen}
        >
          Edit
        </Button>

        <Button variant="contained" onClick={handleDeleteOpen}>
          Delete
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Recipe</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              defaultValue={props.details.name}
              margin="normal"
              required
              fullWidth
              type="text"
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              defaultValue={props.details.description}
              margin="normal"
              required
              fullWidth
              type="text"
              id="description"
              label="Describe the recipe"
              name="description"
              autoComplete="description"
              autoFocus
            />
            <Stack direction="column" spacing={1}>
              {ingredients.map((ingredient, index) => (
                <Chip
                  label={ingredient}
                  onDelete={() => handleDelete(ingredient)}
                  key={index}
                />
              ))}
            </Stack>

            <TextField
              margin="normal"
              required={props.details.ingredients.length === 0}
              fullWidth
              type="text"
              id="ingredient"
              label="Add the list of ingredients"
              name="ingredient"
              autoComplete="ingredient"
              autoFocus
              onChange={(e) => {
                setNewingredient(e.target.value);
              }}
            />
            <div style={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIngredients((current) => [...current, newingredient]);
                }}
              >
                Add
              </Button>
            </div>
            <TextField
              margin="normal"
              defaultValue={props.details.cookingInstructions}
              required
              fullWidth
              multiline
              rows={10}
              type="text"
              id="cookinginstructions"
              label="Cooking Instructions"
              name="cookinginstructions"
              autoComplete="cookinginstructions"
              autoFocus
            />

            <br></br>

            <img
              src={props.image}
              alt="Uploaded"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />

            <p style={{ textAlign: "center" }}>{props.details.name}</p>
            {loading ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                <TailSpin
                  visible={loading}
                  height="30"
                  width="30"
                  color="white"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                SAVE CHANGES
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={deletenotification}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
        <DialogContent>Delete the Recipe ?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleterecipe} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function Viewrecipe(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button variant="contained" onClick={handleClickOpen}>
        View Recipe
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {props.details.name}
          <br></br>
          <sub>
            Uploaded by {props.userfirstname} {props.userlastname} on{" "}
            {props.details.date}
          </sub>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <h3>Description</h3>
          <br></br>
          <Typography gutterBottom>{props.details.description}</Typography>
          <br></br>
          <h3>Ingredients</h3>
          <br></br>

          <ul>
            {props.details.ingredients &&
              props.details.ingredients.map((item, index) => {
                return (
                  <li key={index}>
                    <Typography>{item.ingredient}</Typography>
                  </li>
                );
              })}
          </ul>

          <br></br>
          <h3>Cooking Instructions</h3>
          <br></br>
          <Typography gutterBottom>
            {props.details.cookingInstructions}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
