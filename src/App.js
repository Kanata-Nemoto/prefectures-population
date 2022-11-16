import React from "react";
import Header from "./component/Header";
import Main from "./component/Main";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
