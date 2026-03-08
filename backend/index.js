const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'to_do_list'  
});

app.get('/', (req, res) => {
  res.send('Backend is alive! hi');
});

db.connect(err => {
  if (err) {
    console.error('fail err:', err);
  } else {
    console.log('success');
  }
});

app.post('/addtodo', (req, res) => {
  const { todo, description, date, priority, iscompleted = 0 } = req.body;

  const sql = 'INSERT INTO `to do cards` (todo, description, date, priority, iscompleted) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [todo, description, date, priority, iscompleted], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send({ id: result.insertId });
  });
});

app.get('/todaytodos',(req, res)=>{
  const sql = `SELECT * FROM \`to do cards\` WHERE date=CURDATE() ORDER BY
  iscompleted ASC,
  CASE priority
    WHEN 'High' THEN 1
    WHEN 'Medium' THEN 2
    WHEN 'Low' THEN 3
    ELSE 4
  END;`;
   db.query(sql,(err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send(result);
  });
});
app.put('/completetodos', (req, res) => {
  const { id, iscompleted } = req.body;

  if (iscompleted == 0) {
    const sql = 'UPDATE `to do cards` SET iscompleted = 1 WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.send({ success: true, message: 'Todo marked as completed' });
    });
  } else if (iscompleted == 1) {
    const sql = 'UPDATE `to do cards` SET iscompleted = 0 WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.send({ success: true, message: 'Todo marked as not completed' });
    });
  } else {
    res.status(400).send({ error: 'Invalid iscompleted value' });
  }
});

app.get('/othertodos', (req, res) => {
  const sql = `SELECT * FROM \`to do cards\`
    WHERE date >= DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    ORDER BY 
      date ASC,
      iscompleted ASC,
      CASE priority
        WHEN 'High' THEN 1
        WHEN 'Medium' THEN 2
        WHEN 'Low' THEN 3
        ELSE 4
        END`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching other todos:', err);
      return res.status(500).send('Server error');
    }
    res.send(result);
  });
});

app.delete('/deletetodo', (req, res) => {
  const {id} = req.body;

  if (!id) {
    return res.status(400).send({ error: 'Missing todo id' });
  }

  const sql = 'DELETE FROM `to do cards` WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting todo:', err);
      return res.status(500).send({ error: 'Server error' });
    }

    if (result.affectedRows === 0) {

      return res.status(404).send({ error: 'Todo not found' });
    }

    res.send({ success: true, message: 'Todo deleted successfully' });
  });
}); 

app.put('/edittodo',(req,res)=>{
   const { todo, description, date, priority, iscompleted ,id } = req.body;

  const sql = 'UPDATE `to do cards` SET todo = ?, description = ?, date = ?, priority = ? WHERE id = ?';

  db.query(sql, [todo, description, date, priority,id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.send({message:'updated task with',id: result.updatedId });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
