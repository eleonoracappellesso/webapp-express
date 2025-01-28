const connection = require("../connection.js");

function index(req, res) {
    const sql = 'SELECT * FROM `movies`'
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
    const sql =
        `SELECT movies.*, AVG(reviews.vote) AS vote_average 
        FROM movies
        JOIN reviews ON reviews.movie_id = movies.id
        WHERE movies.id = ?
        GROUP BY movies.id;`
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({
            error: 'DB query failed'
        });
        const item = results[0]; // il primo film si trova in indice 0
        if (!item) {
            return res.status(404).json({
                error: 'Nessun film trovato'
            });
        }
        const sqlReviews =
            `SELECT * FROM reviews
            WHERE movie_id = ?`;
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

}

function storeReview(req, res) {
    // Recuperiamo l'id
    const { id } = req.params;

    // Recuperiamo il body
    const { text, name, vote } = req.body;

    // Prepariamo la query
    const sql =
        "INSERT INTO reviews (text, name, vote, book_id) VALUES (?, ?, ?, ?)";

    // Eseguiamo la query
    //console.log(results); // results contains rows returned by server
    //  console.log(fields); // fields contains extra meta data about results, if available
    connection.query(sql, [text, name, vote, id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database query failed" });
        //console.log(results);
        res.status(201);
        res.json({ message: "Review added", id: results.insertId });
    });
}

function update(req, res) {

}

function destroy(req, res) {
    const id = parseInt(req.params.id);
    const sql = "DELETE FROM `movies` WHERE  `id` = ?";
    connection.query(sql, [id], (err, results) => {
        if (err) res.status(500).json({ error: "Errore del server" });
        res.sendStatus(204);
    });
}

module.exports = { index, show, store, storeReview, update, destroy };