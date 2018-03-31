var React = require('react');
var MDTextContext = require('text-context');

function HelloBlock(props) {
  return (
    <MDTextContext.Consumer>{ (T) =>
      <div style={ { padding: "0 0 20px 30px", borderBottom: "solid 1px" } }>
        <T.p text={{ key: "greetings.hello", who: props.name, context: props.style}} />
        <T.p text={{ key: "greetings.howdy", who: props.name, context: props.style}} style={{ fontSize:"90%" }} />
        <T.text tag='section' text="longTime" context={props.days} />
        <T.text tag='article' text='lorem' style={ { padding: "10px 50px" }}/>
        <T.a text={{ key: "greetings.bye", who: props.name, context: props.style}} onClick={ () => alert("Cya")} href="#"/>
      </div>
    }</MDTextContext.Consumer>
  );
}

module.exports = HelloBlock
