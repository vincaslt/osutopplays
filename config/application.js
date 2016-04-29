module.exports.application = {
    /**
    * Rank of the last player the application gets the scores for
    */
    rankLimit: 100,

    /**
    * The amount of scores the application puts in a list
    */
    scoresLimit: 50,

    /**
    * The interval (in milliseconds) between parsing scores
    * Recommended: minimum 500
    */
    parseInterval: 500,

    /**
    * Number of requests application is allowed to send to Osu!API per second
    */
    apiInterval: 10
}
