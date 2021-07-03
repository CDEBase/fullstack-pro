import React, { Component } from 'react'

const pJson = require('../../../package.json');
const timeTrackerIcon = require('../../../assets/icon.png');

export default class About extends Component {

  render() {
    return (
      <div className='window'>
        <div className='mt-45 text-center' style={{ width: 500 }}>
          <img src={timeTrackerIcon} style={{ width: 64 }} />
          <div className='version'>Version {pJson.version}</div>
          <div>copyright &copy; cqb325@163.com</div>
        </div>
      </div>
    )
  }
}
