var React = require('react');
var T = require('i18n-react').default;

class HelloBlock extends React.Component {
  render() {
    return (
    <div style={ { padding: "0 0 20px 30px", borderBottom: "solid 1px" } }>
      <T.p text={{ key: "greetings.hello", who: this.props.name, context: this.props.style}} />
      <T.p text={{ key: "greetings.howdy", who: this.props.name, context: this.props.style}} style={{ fontSize:"90%" }} />
      <T.text tag='section' text="longTime" context={this.props.days} />
      <T.text tag='article' text='lorem' style={ { padding: "10px 50px" }}/>
      <T.a text={{ key: "greetings.bye", who: this.props.name, context: this.props.style}} onClick={ () => alert("Cya")} href="#"/>
    </div>
    );
  }
}

module.exports = HelloBlock
