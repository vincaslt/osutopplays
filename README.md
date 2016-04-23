# osufreepp

#Information

Application which lists 100(?) most PP osu scores.

Currently implemented:

* Parsing of top players from osu website
* Collecting top scores from osu API

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
