import React from 'react'
import { resolve } from "react-resolver";
import axios from 'axios'
import Score from './Score.jsx'

class ScoreList extends React.Component {
    render() {
        var scoreNodes = this.props.scores.map(function(score) {
            return <Score key={score.id} info={score}/>
        })

        return (
            <ol>{scoreNodes}</ol>
        )
    }
}

export default resolve("scores", function(props) {
  return axios.get('/highScores').then((res) => res.data)
})(ScoreList)
