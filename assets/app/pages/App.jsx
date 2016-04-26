import React from 'react'
import { Link } from 'react-router'
import ScoreList from '../components/es6/ScoreList.jsx'

export default React.createClass({
    render() {
        return <div><h1>Osu top plays:</h1><ScoreList></ScoreList></div>
    }
})
