const connection = require("../connection.js");

function index(req, res) {
  const sql = 'SELECT * FROM `books`'
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });
    console.log(results);
    let data = results;
    const response = {
      totalCount: results.length,
      data,
    };
    res.json(response);

  });
}

function show(req, res) {
  const id = parseInt(req.params.id);
  //const sql = 'SELECT * FROM `books` WHERE `id` = ?';
  const sql =
    `SELECT books.*, AVG(reviews.vote) AS vote_average 
  FROM books
  JOIN reviews ON reviews.book_id = books.id
  WHERE books.id = ?
  GROUP BY books.id;` // in questo modo nell'item mi troverò una chiave in più con la media dei voti

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({
      error: 'DB query failed'
    });
    const item = results[0]; // il primo libro si trova in indice 0
    if (!item) {
      return res.status(404).json({
        error: 'Nessun libro trovato'
      });
    }
    // console.log("ID ricevuto per i tag:", id);

    const sqlReviews =
      `SELECT * FROM reviews
         WHERE book_id = ?`;
    connection.query(sqlReviews, [id], (err, reviews) => {
      console.log(results);
      if (err) return res.status(500).json({
        error: 'DB query failed'
      });
      item.reviews = reviews;
      res.json({
        success: true,
        item
      });
    });

  });
}

function store(req, res) {
  // // creo l'id per il nuovo post
  // let newId = 0;
  // for (let i = 0; i < allPosts.posts.length; i++) {
  //   if (allPosts.posts[i].id > newId) {
  //     newId = allPosts.posts[i].id;
  //   }
  // }
  // newId += 1;
  // // creo il nuovo post
  // const newPost = {
  //   id: newId,
  //   title: req.body.title,
  //   content: req.body.content,
  //   img: req.body.img,
  //   tags: req.body.tags, // ['a', 'b', ...]
  //   published: req.body.published
  // };
  // // aggiungo il nuovo post al mio array di post
  // allPosts.posts.push(newPost);
  // console.log(newPost)
  // res.status(201).json(newPost);
}

function update(req, res) {
  // const id = parseInt(req.params.id);
  // const item = allPosts.find((item) => item.id === id);
  // if (!item) {
  //   res.status(404).json({ success: false, message: "Il post è inesistente" });
  //   return;
  // }

  // console.log(req.body);
  // item.title = req.body.title;
  // item.content = req.body.content;
  // item.image = req.body.image;
  // item.tags = req.body.tags;
  // // for (key in item) {
  // //     if (key !== "id") {
  // //         item[key] = req.body[key];
  // //     }
  // // }

  // console.log(allPosts);
  // res.json(item);
}

function destroy(req, res) {
  const id = parseInt(req.params.id);
  const sql = 'DELETE FROM `posts` WHERE `id` = ?';
  connection.query(sql, [id], (err, res) => {
    if (err) return res.status(500).json({
      error: 'DB query failed'
    });
    res.sendStatus(204);
  })
}

module.exports = { index, show, store, update, destroy };