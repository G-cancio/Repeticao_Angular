module.exports = function(app) {

    app.get('/user', (req, res) => {
        const connection = app.infra.connectionFactory();
        const { nome } = req.query;

        const sql = `
            SELECT
                user_id AS id,
                user_name AS nome,
                user_email AS email,
                user_password AS senha
            FROM user
            WHERE user_name = ?
        `;

        connection.get(sql, [nome], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(row || null);
        });
        connection.close();
    });
};