import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { TailSpin } from "react-loader-spinner";

import Stack from "@mui/material/Stack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function FormDialog(props) {
  const [imagename, setImagename] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState(null);

  const [currentuserid, setCurrentuserid] = useState("");
  const [file, setFile] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const { enqueueSnackbar } = useSnackbar();
  const handleClose = () => {
    setOpen(false);
  };
  var today = new Date();

  // Get the day of the month
  var dd = today.getDate();

  // Get the month (adding 1 because months are zero-based)
  var mm = today.getMonth() + 1;

  // Get the year
  var yyyy = today.getFullYear().toString();

  // Add leading zero if the day is less than 10
  if (dd < 10) {
    dd = "0" + dd;
  }

  // Add leading zero if the month is less than 10
  if (mm < 10) {
    mm = "0" + mm;
  }
  var todaydate = dd + "-" + mm + "-" + yyyy;

  // Format the date as mm-dd-yyyy and log it

  const [ingredients, setIngredients] = React.useState([]);
  const [newingredient, setNewingredient] = React.useState("");
  //console.log(newingredient);
  const handleDelete = (ingredient) => {
    setIngredients(ingredients.filter((x) => x !== ingredient));
    console.log(ingredient);
  };

  //const [file, setFile] = React.useState();
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    // Do something with the selected file, such as upload or display it

    setFile(selectedFile);

    displayImage(selectedFile);
    // axios
    //   .post("http://localhost:8080/api/v1/user/upload", selectedFile, {
    //     headers,
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //     // enqueueSnackbar(response.data.text, {
    //     //   variant: "success",
    //     //   autoHideDuration: 5000,
    //     // });
    //   })
    // .catch(function (error) {});
  };
  const displayImage = (file) => {
    const reader = new FileReader();
    setImagename(file.name);

    reader.onload = (e) => {
      const imageDataURL = e.target.result.toString();
      // Update state or directly display the image as needed

      setUploadedImage(imageDataURL);
    };

    reader.readAsDataURL(file);
  };

  const fetchData = useCallback(async () => {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const res = await axios.get(
      "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user",
      {
        headers,
      }
    );

    //console.log(response.data);

    setCurrentuserid(res.data.id);
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (event) => {
    setLoading(true);
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const uploadImageData = new FormData();
    uploadImageData.append("file", file, file.name);

    try {
      const imageuploadResponse = await axios.post(
        "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user/upload",
        uploadImageData,
        { headers }
      );
      const downloadresponse = await axios.get(
        "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user/download/" +
          imageuploadResponse.data,
        {
          responseType: "arraybuffer",
          headers: { ...headers },
        } // Specify the response type as arraybuffer
      );
      const image = new Blob([downloadresponse.data]);
      const imageUrl = URL.createObjectURL(image);

      const userEnteredRecipe = {
        name: data.get("name"),
        date: todaydate,
        description: data.get("description"),
        cookingInstructions: data.get("cookinginstructions"),
        image: imageuploadResponse.data,
      };
      const response = await axios.post(
        "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user/addrecipe/" +
          currentuserid,
        userEnteredRecipe,
        { headers }
      );
      //console.log(ingredients);
      const ingredientsJsonform = [];
      ingredients.forEach((item) => {
        ingredientsJsonform.push({ ingredient: item });
      });
      userEnteredRecipe.ingredients = ingredientsJsonform;
      userEnteredRecipe.id = response.data.text;
      props.setRecipedetails((prevArray) => [...prevArray, userEnteredRecipe]);
      props.setImageData((prev) => ({
        ...prev,
        [userEnteredRecipe.image]: imageUrl,
      }));
      const addingredientsResponse = await axios.post(
        "http://recipesharingapp-env.eba-x7bedbpp.ap-south-1.elasticbeanstalk.com/api/v1/user/addingredients/" +
          response.data.text,
        { ingredients: ingredients },
        { headers }
      );
      console.log(addingredientsResponse.data);
      setLoading(false);
      enqueueSnackbar("Recipe added successfully", {
        variant: "success",
        autoHideDuration: 5000,
      });
    } catch (error) {
      setLoading(false);
      console.log("Internal server error");
      enqueueSnackbar("Internal Server error", {
        variant: "Error",
        autoHideDuration: 5000,
      });
    }

    setOpen(false);
    setIngredients([]);
    setUploadedImage(null);
    setImagename("");
    setNewingredient("");
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Recipe
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>New Recipe</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
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
              required={ingredients.length === 0}
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
            <div style={{ textAlign: "center" }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            </div>
            <br></br>
            {uploadedImage == null ? null : (
              <img
                src={uploadedImage}
                alt="Uploaded"
                style={{ maxWidth: "100%", maxHeight: "300px" }}
              />
            )}
            <p style={{ textAlign: "center" }}>{imagename}</p>
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
                ADD RECIPE
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
