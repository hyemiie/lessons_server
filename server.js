const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { connect } = require('./models/db');

const lessonsRouter = require('./routes/lesson');
const ordersRouter = require('./routes/order');
const logger = require('./logger');

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(logger); 

app.use('/api/lessons', lessonsRouter);
app.use('/api/orders', ordersRouter);

app.get('/health_check', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });
