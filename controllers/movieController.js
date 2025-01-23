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

}

function store(req, res) {

}

function update(req, res) {

}

function destroy(req, res) {

}

module.exports = { index, show, store, update, destroy };