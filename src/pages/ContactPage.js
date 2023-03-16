import React, { Component } from 'react'
import LinkHere from '../components/LinkHere/LinkHere'
import Contact from '../components/Contact/Contact'

export default class ContactPage extends Component {
  render() {
    setTimeout(() => {
      console.log('xxxsx');
      window.scrollTo(0, 0);
    }, 100);
    const url = this.props.match.match.url;
    return (
      <div>
        <LinkHere url='/ Liên hệ'></LinkHere>
        <Contact></Contact>
      </div>
    )
  }
}
