import React from 'react'
import { Link } from 'react-router'
import ScoreList from '../components/es6/ScoreList.jsx'
import { PageHeader } from 'react-bootstrap'

export default React.createClass({
    render() {
        return (
            <div>
                <div className="container">
                    <PageHeader>Osu top plays:</PageHeader>
                    <ScoreList></ScoreList>
                </div>
                <footer className="footer">
                    <div className="container">
                        <p className="text-muted">
                            Created by <a href="http://jizz.ppy.sh/u/3820339#osu">vincaslt</a> at <a href="http://stonyvin.net">stonyvin.net</a>
                        </p>
                    </div>
                </footer>
            </div>
        )
    }
})
