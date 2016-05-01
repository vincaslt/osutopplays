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
        var rankIcon = "/images/ranks/" + info.rank + "@2x.png"

        var getCountryFlag = function(country) {
            var clName = "flag flag-" + country.toLowerCase()
            return (
                <img src="/images/blank.gif" className={clName} title={country} alt={country}/>
            )
        }

        var beatmapPopover = (
            <Popover title={fullTitle}>
                <div className="beatmap-popover">
                    <img className="beatmap-bg" src={info.beatmap.image}/>
                    <div>
                        <h4>{info.beatmap.version}</h4><small><i>By: {info.beatmap.creator}</i></small><br/>
                    </div>
                    <div className="clear-both"></div>
                </div>
            </Popover>
        )

        var playerPopover = (
            <Popover title={info.player.name}>
                <div className="player-popover">
                    <img className="profile-image" src={info.player.image}/>
                    <div>
                        <h4>{info.player.pp}pp (#{info.player.rank})</h4>
                        <span>Country rank: {info.player.countryRank}</span><br/>
                        <span>Country: {getCountryFlag(info.player.country)}</span><br/>
                    </div>
                    <div className="clear-both"></div>
                </div>
            </Popover>
        )

        var scorePopover = (
            <Popover>
                <div className="score-popover">
                    <img className="rank-icon" src={rankIcon} alt={info.rank}/>
                    <div>
                        <span>Combo: {info.maxCombo}</span><br/>
                        <span>Score: {info.score}</span><br/>
                        <span>Accuracy: {info.accuracy}%</span><br/>
                    </div>
                    <div className="clear-both"></div>
                </div>
            </Popover>
        )

        return (
            <tr>
                <td>{this.props.ranking}</td>
                <td>
                    <OverlayTrigger trigger="hover" placement="bottom" overlay={playerPopover}>
                        <a href={profileUrl} target="_blank">{info.player.name}</a>
                    </OverlayTrigger>
                </td>
                <td>
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={beatmapPopover}>
                        <a href={beatmapUrl} target="_blank">{info.beatmap.artist} - {info.beatmap.title} [{info.beatmap.version}]</a>
                    </OverlayTrigger>
                </td>
                <td>
                    <OverlayTrigger trigger="hover" placement="bottom" overlay={scorePopover}>
                        <span>{info.pp}</span>
                    </OverlayTrigger>
                </td>
            </tr>
        )
    }
}
