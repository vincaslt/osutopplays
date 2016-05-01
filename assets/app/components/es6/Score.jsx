import React from 'react'

export default class Score extends React.Component {
    propTypes: {
        info: React.PropTypes.object.isRequired
    }

    render() {
        var info = this.props.info
        return <li><b>{info.player.name}</b>: {info.beatmap.title} [{info.beatmap.version}] - {info.pp}</li>
    }
}
