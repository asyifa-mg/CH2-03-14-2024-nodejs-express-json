//console.log("Hello FSW 1 Luar biasa");
const fs = require("fs");
const express = require("express");
const app = express();
const PORT = 8000;

//middelware
app.use(express.json());

const customers = JSON.parse(fs.readFileSync(`${__dirname}/data/dummy.json`));

const defaultRouter = (req, res, next) => {
  res.send("<p>Hello FSW 1 Tercinta </p>");
};

//Localhost:8000
app.get("/", (req, res, next) => {
  res.send("<h1>Hello FSW 1 Tercinta..</h1>");
});

const getCustomers = (req, res, next) => {
  res.status(200).json({
    status: "success",
    totalData: customers.length,
    data: {
      customers,
    },
  });
};

//api utk get data by id
const getCustomersById = (req, res, next) => {
  //shorhcut pemanggilan objek
  const id = req.params.id;
  //menggunakan array method untuk membntu menemukan spesifik data
  const customer = customers.find((cust) => cust._id === id);
  //console.log(customer);
  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
};

//api untuk update data
const updateCustomer = (req, res) => {
  const id = req.params.id;
  console.log("masuk tidak ya");

  //1. lakukan pencarian data yang sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  // 2. ada gak data customer nya
  if (!customer) {
    //pencarian jika data tdk ada
    return res.status(404).json({
      status: "fail",
      message: `Customer dengan ID: ${id}" gak ada`,
    });
  }
  //3. kalau ada berarti update data nya sesuai request body dari client/user
  customers[customerIndex] = { ...customers[customerIndex], ...req.body };
  console.log(customers[customerIndex]);
  //4. melakukan update didokumen
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(201).json({
        status: "success",
        message: "berhasil update data",
        data: {
          customer: customer[customerIndex],
          customer,
        },
      });
    }
  );
  //res.status(200).json({});
};

// API membuat data baru atau untuk bagian collection "create new customer" di postman
const createCustomer = (req, res) => {
  console.log(req.body);
  // const newId = Math
  // const newCustomers = Object.assign
  const newCustomer = req.body;
  customers.push(newCustomer);
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          customer: newCustomer,
        },
      });
    }
  );
};

//API UNTUK DELETE DATA
const deleteCustomer = (req, res) => {
  const id = req.params.id;
  //console.log("masuk tidak ya");
  //1. lakukan pencarian data yang sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  // // 2. ada gak data customer nya
  if (!customer) {
    //pencarian jika data tdk ada
    return res.status(404).json({
      status: "fail",
      message: `Customer dengan ID: ${id}" gak ada`,
    });
  }
  //3. kalau ada berarti update data nya sesuai request body dari client/user
  customers.splice(customerIndex, 1);
  //4. melakukan update didokumen
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(201).json({
        status: "success",
        message: "berhasil delete data",
        data: {
          customer: customer[customerIndex],
          customer,
        },
      });
    }
  );
};

app.get("/", defaultRouter);
app.route("/api/v1/customers").get(getCustomers).post(createCustomer);
app
  .route("/api/v1/customers/:id")
  .get(getCustomersById)
  .patch(updateCustomer)
  .delete(deleteCustomer);

app.listen(PORT, () => {
  console.log(`APP running on port : ${PORT}`);
});
