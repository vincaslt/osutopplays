import React from 'react'

export default class Score extends React.Component {
    propTypes: {
        info: React.PropTypes.object.isRequired
    }

    render() {
        var info = this.props.info
        return (
            <tr>
                <td>{this.props.ranking}</td>
                <td>{info.player.name}</td>
                <td>{info.beatmap.title} [{info.beatmap.version}]</td>
                <td>{info.pp}</td>
            </tr>
        )
    }
}
