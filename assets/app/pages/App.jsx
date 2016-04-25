import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
      console.log('a')
    return <div>Hello, React Router! <Link to="/test">Test</Link> </div>
  }
})
