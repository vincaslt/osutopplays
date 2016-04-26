import React from 'react'
import { resolve } from "react-resolver";
import axios from 'axios'

class Score extends React.Component {
    render() {
        return <li>{this.props.data.beatmapId}: <b>{this.props.data.player.name}</b>: {this.props.data.pp}</li>
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
