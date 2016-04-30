# osutopplays

#Information

Application which lists top osu scores by pp

Currently implemented:

* Parsing of top players from osu website
* Collecting top scores from osu API
* Collecting relevant beatmap info

#Usage:

1. Request for API key here: https://osu.ppy.sh/p/api
2. Add property to `config/local.js`:
    `apiKey: "123456789abcdef" // Your api key instead of 123...`
3. Run:
    ```
    npm install -g babel-cli
    npm install
    sails lift
    ```
