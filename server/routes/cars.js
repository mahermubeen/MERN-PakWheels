const router = require("express").Router();
const Car = require("../models/car");

/* Api to add Car */
router.post("/add-car", async (req, res) => {
  try {
    if (
      req.body &&
      req.body.color &&
      req.body.model &&
      req.body.make &&
      req.body.regis_no &&
      req.body.categ &&
      req.body.user_id
    ) {
      let new_car = await new car();
      new_car.color = req.body.color;
      new_car.model = req.body.model;
      new_car.make = req.body.make;
      new_car.regis_no = req.body.regis_no;
      new_car.categ = req.body.categ;
      new_car.user_id = req.body.user_id;

      new_car.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false,
          });
        } else {
          res.status(200).json({
            status: true,
            title: "Car Added successfully.",
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/* Api to update Car */
router.post("/update-car", async (req, res) => {
  try {
    if (
      req.body &&
      req.body.color &&
      req.body.model &&
      req.body.make &&
      req.body.regis_no &&
      req.body.categ &&
      req.body.id
    ) {
      Car.findById(req.body.id, (err, new_car) => {
        if (req.body.color) {
          new_car.color = req.body.color;
        }
        if (req.body.model) {
          new_car.model = req.body.model;
        }
        if (req.body.make) {
          new_car.make = req.body.make;
        }
        if (req.body.regis_no) {
          new_car.regis_no = req.body.regis_no;
        }
        if (req.body.categ) {
          new_car.categ = req.body.categ;
        }

        new_car.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false,
            });
          } else {
            res.status(200).json({
              status: true,
              title: "Car updated.",
            });
          }
        });
      });
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/* Api to delete Car */
router.post("/delete-car", async (req, res) => {
  try {
    if (req.body && req.body.id) {
      Car.findByIdAndUpdate(
        req.body.id,
        { is_delete: true },
        { new: true },
        (err, data) => {
          if (data.is_delete) {
            res.status(200).json({
              status: true,
              title: "Car deleted.",
            });
          } else {
            res.status(400).json({
              errorMessage: err,
              status: false,
            });
          }
        }
      );
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/*Api to get and search Car with pagination and search by name*/
router.get("/get-car/:id", async (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.params.id,
    });

    var perPage = 5;
    var page = req.query.page || 1;
    Car.find(query, {
      date: 1,
      regis_no: 1,
      categ: 1,
      color: 1,
      id: 1,
      model: 1,
      make: 1,
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .then((data) => {
        Car.find(query)
          .count()
          .then((count) => {
            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: "Car retrived.",
                cars: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: "There is no car!",
                status: false,
              });
            }
          });
      })
      .catch((err) => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false,
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/*Api to  search Cars with category name*/
router.get("/search-cars/:id", async (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.params.id,
      categ: req.query.categ,
    });

    var perPage = 5;
    var page = req.query.page || 1;
    Car.find(query, {
      date: 1,
      regis_no: 1,
      categ: 1,
      color: 1,
      id: 1,
      model: 1,
      make: 1,
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .then((data) => {
        Car.find(query)
          .count()
          .then((count) => {
            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: "Car retrived.",
                cars: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: "There is no car!",
                status: false,
              });
            }
          });
      })
      .catch((err) => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false,
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

module.exports = router;
