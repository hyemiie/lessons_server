const express = require('express');
const router = express.Router();
const { connect } = require('../models/db');
const { ObjectId } = require('mongodb');

async function coll() {
  const db = await connect();
  return db.collection('Lessons'); 
}

router.get('/', async (req, res) => {
  try {
    const c = await coll();
    // const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    // const skip = parseInt(req.query.skip) || 0;
    // const items = await c.find({}).skip(skip).limit(limit).toArray();
    const lessons = await c.find().toArray()
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/lessons', async(req,res) =>{
  try{
    const Lessonss = await coll();
    const all_lessons = Lessonss.findAll()
    console.log(all_lessons)
  }
  catch(err){
    console.log("err", err)

  }
})

router.get('/:id', async (req, res) => {
  try {
    const c = await coll();
    const id = req.params.id;
    const item = await c.findOne({ _id: new ObjectId(id) });
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
    // basic validation (change as needed)
    if (!payload.title) return res.status(400).json({ error: 'title required' });
    const result = await c.insertOne(payload);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
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

router.delete('/:id', async (req, res) => {
  try {
    const c = await coll();
    const id = req.params.id;
    const result = await c.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;
