import React from 'react'
import { Popover, OverlayTrigger, Button, ButtonToolbar } from 'react-bootstrap'

export default class Score extends React.Component {
    propTypes: {
        info: React.PropTypes.object.isRequired
    }

    render() {
        var info = this.props.info

        var profileUrl = "http://jizz.ppy.sh/u/" + info.player.id + "#osu"
        var beatmapUrl = "https://osu.ppy.sh/b/" + info.beatmap.beatmapId + "&m=0"
        var fullTitle = info.beatmap.artist + " - " + info.beatmap.title
        var rankIcon = "/images/ranks/" + info.rank + ".png"

        var beatmapPopover = (
            <Popover title={fullTitle}>
                <div className="info-popover">
                    <img className="beatmap-bg" src={info.beatmap.image}/>
                    <div>
                        <h4>{info.beatmap.version}</h4><small><i>By: {info.beatmap.creator}</i></small><br/>
                        <img className="rank-icon" src={rankIcon}/>
                    </div>
                    <div className="clear-both"></div>
                </div>
            </Popover>
        )

        return (
            <tr>
                <td>{this.props.ranking}</td>
                <td>
                    <a href={profileUrl} target="_blank">{info.player.name}</a>
                </td>
                <td>
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={beatmapPopover}>
                        <a href={beatmapUrl} target="_blank">{info.beatmap.artist} - {info.beatmap.title} [{info.beatmap.version}]</a>
                    </OverlayTrigger>
                </td>
                <td>{info.pp}</td>
            </tr>
        )
    }
}
