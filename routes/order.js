const express = require('express');
const router = express.Router();
const { connect } = require('../models/db');
const { ObjectId } = require('mongodb');

async function coll() {
  const db = await connect();
  return db.collection('order'); 
}

router.get('/', async (req, res) => {
  try {
    const c = await coll();
    const items = await c.find({}).limit(10).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const c = await coll();
    const item = await c.findOne({ _id: new ObjectId(req.params.id) });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

router.post('/', async (req, res) => {
  try {
    const c = await coll();
    const payload = req.body;
    console.log( "req", req.body)
    if (!payload.id || !payload.price) return res.status(400).json({ error: 'payload details incomplete' });
    const result = await c.insertOne(Object.assign({ createdAt: new Date() }, payload));
    console.log("result", result)
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.log("error", err)
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const c = await coll();
    const id = req.params.id;
    const payload = req.body;
    const result = await c.updateOne({ _id: new ObjectId(id) }, { $set: payload });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});


// router.delete('/:id', async (req, res) => {
//   try {
//     const c = await coll();
//     const id = req.params.id.trim();
//     console.log("id", new ObjectId(id))
//     const id2 =  new ObjectId(id)
//     console.log("id",id2)


//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid ObjectId' });
//     }

//     const result = await c.findOne({ _id: new ObjectId(id) });
//     console.log("result", result)
//     if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });

//     res.json({ deletedCount: result.deletedCount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


router.delete('/:id', async (req, res) => {
  try {
    const c = await coll();
    const id = req.params.id.trim();

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    console.log("Deleting id:", JSON.stringify(id));


    const objectId = new ObjectId(id);
    const result = await c.deleteOne({ _id: id });
    console.log("result", result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
