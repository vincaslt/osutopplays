import React from 'react'
import { resolve } from "react-resolver";
import axios from 'axios'
import Score from './Score.jsx'
import { Table } from 'react-bootstrap'

class ScoreList extends React.Component {
    render() {
        var ranking = 1;
        var scoreNodes = this.props.scores.map(function(score) {
            return <Score ranking={ranking++} key={score.id} info={score}/>
        })

        return (
            <Table className="scoreboard" striped condensed hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Beatmap</th>
                        <th>Performance</th>
                    </tr>
                </thead>
                <tbody>
                    {scoreNodes}
                </tbody>
            </Table>
        )
    }
}

export default resolve("scores", function(props) {
  return axios.get('/highScores').then((res) => res.data)
})(ScoreList)
