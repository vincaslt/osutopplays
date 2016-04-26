module.exports = {
    highScores: function (req, res) {
        ScoreService.getHighScores(1, 200, function(err, scores) {
            res.json(scores);
        });
    }
}
