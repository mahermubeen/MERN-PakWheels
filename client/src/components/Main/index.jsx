import React, { Component, useState, useEffect } from "react";
import styles from "./styles.module.css";
import cross from "../../images/cross.png";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  LinearProgress,
  DialogTitle,
  DialogContent,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import swal from "sweetalert";
const axios = require("axios");

const Main = (props) => {
  const [token, setToken] = useState("");
  const [openCarModal, setOpenCarModal] = useState(false);
  const [openCarEditModal, setOpenCarEditModal] = useState(false);
  const [id, setId] = useState("");
  const [user_id, setUser_id] = useState("");
  const [color, setColor] = useState("");
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [regis_no, setRegis_no] = useState("");
  const [categ, setCateg] = useState("");
  const [page, setPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectCateg, setSelectCateg] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [car_categ, setCar_categ] = useState([
    "HatchBack",
    "Sedan",
    "Sports Car",
    "Minivan",
    "Crossover",
    "SUV",
  ]);

  useEffect(() => {
    let token = localStorage.getItem("token");
    let id = localStorage.getItem("user_id");

    if (!token) {
      props.history.push("/login");
    } else {
      setToken(token);
      setUser_id(id);
      getCar();
    }
  }, []);

  useEffect(() => {
    getCar();
  }, [page]);

  const handleCategSearch = (event) => {
    setShowFilter(true);

    let categName = event.target.value;
    setSelectCateg(categName);
    setLoading(true);
    let id = user_id;
    if (categName !== "") {
      axios
        .get(
          `http://localhost:8080/api/cars/search-cars/${id}?categ=${categName}`,
          {
            headers: {
              token: token,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setCars(res.data.cars);
          setPages(res.data.pages);
        })
        .catch((err) => {
          swal({
            text: err.response.data.errorMessage,
            icon: "error",
            type: "error",
          });
          setLoading(false);
          setCars([]);
          setPages(0);
        });
    } else {
      getCar();
    }
  };

  const handleCategories = (event) => {
    let categName = event.target.value;

    setCateg(categName);
  };

  const getCar = async () => {
    setLoading(true);
    let id = localStorage.getItem("user_id");

    let data = "?";
    data = `${data}page=${page}`;

    axios
      .get(`http://localhost:8080/api/cars/get-car/${id}${data}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        setLoading(false);
        setCars(res.data.cars);
        setPages(res.data.pages);
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        setLoading(false);
        setCars([]);
        setPages(0);
      });
  };

  const deleteCar = (id) => {
    axios
      .post(
        "http://localhost:8080/api/cars/delete-car",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      )
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });
        setPage(1);
        pageChange(null, 1);
        getCar();
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      });
  };

  const pageChange = (e, page) => {
    setPage(page);
  };

  const logOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const onChange = (e) => {
    if (e.target.name == "color") setColor(e.target.value);
    if (e.target.name == "model") setModel(e.target.value);
    if (e.target.name == "make") setMake(e.target.value);
    if (e.target.name == "regis_no") setRegis_no(e.target.value);
    if (e.target.name == "categ") setCateg(e.target.value);
  };

  const addCar = () => {
    axios
      .post(
        "http://localhost:8080/api/cars/add-car",
        {
          color: color,
          model: model,
          make: make,
          regis_no: regis_no,
          categ: categ,
          user_id: user_id,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        handleCarClose();

        setColor("");
        setModel("");
        setMake("");
        setRegis_no("");
        setCateg("");
        setPage(1);

        getCar();
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        handleCarClose();
      });
  };

  const updateCar = () => {
    axios
      .post(
        "http://localhost:8080/api/cars/update-car",
        {
          color: color,
          model: model,
          make: make,
          regis_no: regis_no,
          categ: categ,
          id: id,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        handleCarEditClose();

        setColor("");
        setModel("");
        setMake("");
        setRegis_no("");
        setCateg("");

        getCar();
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        handleCarEditClose();
      });
  };

  const handleCarOpen = () => {
    setOpenCarModal(true);
    setId("");
    setColor("");
    setModel("");
    setMake("");
    setRegis_no("");
    setCateg("");
  };

  const handleCarClose = () => {
    setOpenCarModal(false);
  };

  const handleCarEditOpen = (data) => {
    setOpenCarEditModal(true);
    setId(data._id);
    setColor(data.color);
    setModel(data.model);
    setMake(data.make);
    setRegis_no(data.regis_no);
    setCateg(data.categ);
  };

  const handleCarEditClose = () => {
    setOpenCarEditModal(false);
  };

  const handleClearSearch = () => {
    setCateg("");
    setSelectCateg("");
    setShowFilter(false);
    getCar();
  };

  return (
    <>
      {loading && <LinearProgress size={40} />}
      <TableContainer align="center">
        <h2>Pak Wheels</h2>
        <Button
          className="button_style"
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCarOpen}
        >
          Add Car
        </Button>
        <Button
          className="button_style"
          variant="contained"
          size="small"
          onClick={logOut}
        >
          Log Out
        </Button>
      </TableContainer>

      {/* Edit Car */}
      <Dialog
        open={openCarEditModal}
        onClose={handleCarClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit Car</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="color"
            value={color}
            onChange={onChange}
            placeholder="Car Color"
            required
          />
          <br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="model"
            value={model}
            onChange={onChange}
            placeholder="Model Number"
            required
          />
          <br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="make"
            value={make}
            onChange={onChange}
            placeholder="Make"
            required
          />
          <br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="regis_no"
            value={regis_no}
            onChange={onChange}
            placeholder="Registration Number"
            required
          />
          <br />
          <select
            name="categ"
            className="form-control p-2"
            onChange={(e) => handleCategories(e)}
            value={categ}
          >
            <option value="">---Select Category---</option>
            {car_categ.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}{" "}
              </option>
            ))}
          </select>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCarEditClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={
              color == "" ||
              model == "" ||
              make == "" ||
              regis_no == "" ||
              categ == ""
            }
            onClick={(e) => updateCar()}
            color="primary"
            autoFocus
          >
            Edit Car
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Car */}
      <Dialog
        open={openCarModal}
        onClose={handleCarClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Car</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="color"
            value={color}
            onChange={onChange}
            placeholder="Car Color"
            required
          />
          <br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="model"
            value={model}
            onChange={onChange}
            placeholder="Model Number"
            required
          />
          <br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="make"
            value={make}
            onChange={onChange}
            placeholder="Make"
            required
          />
          <br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="regis_no"
            value={regis_no}
            onChange={onChange}
            placeholder="Registration Number"
            required
          />
          <br />
          <select
            name="categ"
            className="form-control p-2"
            onChange={(e) => handleCategories(e)}
          >
            <option value="">--Select Categories--</option>
            {car_categ.map((cat, index) => (
              <option key={index}>{cat} </option>
            ))}
          </select>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCarClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={
              color == "" ||
              model == "" ||
              make == "" ||
              regis_no == "" ||
              categ == ""
            }
            onClick={(e) => addCar()}
            color="primary"
            autoFocus
          >
            Add Car
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer align="center">
        <br />
        <select
          name="categ"
          className="form-control p-2"
          onChange={(e) => handleCategSearch(e)}
          value={selectCateg || ""}
        >
          <option value="">--Select Categories--</option>
          {car_categ.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}{" "}
            </option>
          ))}
        </select>

        {showFilter && (
          <div className={styles.searches}>
            <span>{selectCateg}</span>
            <img src={cross} alt="cross_img" onClick={handleClearSearch} />
          </div>
        )}

        <br />
        <br />

        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Color</TableCell>
              <TableCell align="center">Model No.</TableCell>
              <TableCell align="center">Make</TableCell>
              <TableCell align="center">Registration No.</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.map((row) => (
              <TableRow key={row._id} id="hello">
                <TableCell align="center" component="th" scope="row">
                  {row.color}
                </TableCell>
                <TableCell align="center">{row.model}</TableCell>
                <TableCell align="center">{row.make}</TableCell>
                <TableCell align="center">{row.regis_no}</TableCell>
                <TableCell align="center">{row.categ}</TableCell>
                <TableCell align="center">
                  <Button
                    className="button_style"
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={(e) => handleCarEditOpen(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="button_style"
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={(e) => deleteCar(row._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <br />
        <Pagination
          count={pages}
          page={page}
          onChange={pageChange}
          color="primary"
        />
      </TableContainer>
    </>
  );
};

export default Main;
