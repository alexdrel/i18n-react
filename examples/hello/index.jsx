var ReactDOM = require('react-dom');
var React = require('react');
const { default: T, MDText } = require('i18n-react');

const dictionary = {
  greeting: "###Hello, World!\n My name is **{myName}**! \n {{howAreYou}}",
  howAreYou:  "_How do you do?_"
};

T.setTexts(dictionary, { MDFlavor: 1 })
ReactDOM.render(
  <section>
    <h2>Singelton</h2>
    <T.text text={{ key: "greeting", myName: "i18n-react" }}/>
  </section>,
  document.getElementById('content1')
);

const Texts = new MDText(dictionary, { MDFlavor: 1 });
ReactDOM.render(
  <section>
    <h2>MDText object</h2>
    <Texts.text text={{ key: "greeting", myName: "i18n-react" }}/>
  </section>,
  document.getElementById('content2')
);

let MDTextContext = React.createContext();

ReactDOM.render(
  <section>
    <h2>MDText in React Context</h2>
    <MDTextContext.Provider value={Texts}>
        <MDTextContext.Consumer>{ (TT) =>
          <TT.text text={{ key: "greeting", myName: "i18n-react" }}/>
        }</MDTextContext.Consumer>
    </MDTextContext.Provider>
  </section>,
  document.getElementById('content3')
);

