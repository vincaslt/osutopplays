import React from 'react'
import { resolve } from "react-resolver";
import axios from 'axios'

class Score extends React.Component {
    render() {
        var data = this.props.data
        return <li><b>{data.player.name}</b>: {data.beatmap.title} [{data.beatmap.version}] - {data.pp}</li>
    }
}

class ScoreList extends React.Component {
    render() {
        var scoreNodes = this.props.scores.map(function(score) {
            return <Score key={score.id} data={score}/>
        })

        return (
            <ol>{scoreNodes}</ol>
        )
    }
}

export default resolve("scores", function(props) {
  return axios.get('/highScores').then((res) => res.data)
})(ScoreList)
