const express = require("express");
const cashAccount = require("./schema");
const  { commonEmitter } = require('../events')

const changeStream = cashAccount.watch();

changeStream.on('change', (data) => {
  cashAccount.find((err, doc) => {
    if (err) {
      commonEmitter.emit("cashData", {
        error: err.message
      })
    } else {
      commonEmitter.emit("cashData", doc )
    }
  });
}); 



// Cash Router
const cash = express.Router();

cash.get("/", (req, res) => {
  cashAccount.find((err, doc) => {
    if (err) {
      res.status(404).send(err.message);
    } else {
      res.status(200).json(doc);
    }
  });
});

cash.get("/:id", (req, res) => {
  const id = req.params.id;
  cashAccount.findById(id, (err, doc) => {
    if (err) {
      res.status(404).send(err.message);
    } else {
      res.status(200).json(doc);
    }
  });
});

cash.post("/create-cash-account", (req, res) => {
  const newAccount = new cashAccount(req.body);
  newAccount
    .save()
    .then(status => {
      res.status(201).json(status);
    })
    .catch(error => {
      res.status(404).send(error.message);
    });
});

cash.put("/update-cash-account/:id", (req, res) => {
  const id = req.params.id;
  cashAccount.findByIdAndUpdate(id, req.body, (err, doc) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json({success: true});
    }
  });
});

cash.delete("/delete-cash-account/:id", (req, res) => {
  const id = req.params.id;
  cashAccount.findByIdAndRemove(id, (err, status) => {
    if (err) {
      res.status(400).json(err.message);
    } else {
      res.status(200).json({success: true});
    }
  });
});

module.exports.cash = cash;
