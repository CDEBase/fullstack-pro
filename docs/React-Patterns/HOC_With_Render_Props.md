Reference: https://gist.github.com/mjackson/a1bee5a8b24a0db7ff29586b124cfb38
https://www.youtube.com/watch?v=BcVAq3YFiuc&t=1397s
https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce
```
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

document.body.style.background = `
  linear-gradient(135deg,
    #1e5799 0%,
    #2989d8 50%,
    #207cca 51%,
    #7db9e8 100%
  )
`;

const getHeaderStyle = y => {
  const pin = y >= 100;
  const top = -y / 2;
  return {
    textTransform: "uppercase",
    textAlign: "center",
    width: "100%",
    margin: 0,
    position: "fixed",
    top: pin ? "0px" : `${top + 50}px`,
    textShadow: pin
      ? `0px ${(y - 100) / 5}px ${Math.min(
          (y - 100) / 10,
          20
        )}px rgba(0, 0, 0, 0.5)`
      : "none"
  };
};

class ScrollY extends React.Component {
  state = { y: 0 };

  handleWindowScroll = () => {
    this.setState({ y: window.scrollY });
  };

  componentDidMount() {
    this.handleWindowScroll();
    window.addEventListener("scroll", this.handleWindowScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleWindowScroll);
  }

  render() {
    return this.props.children(this.state.y);
  }
}

class App extends React.Component {
  render() {
    const { y } = this.props;

    return (
      <div style={{ height: "300vh", color: "white" }}>
        <h1 style={getHeaderStyle(y)}>{this.props.message}</h1>
      </div>
    );
  }
}

function withScrollY(Component) {
  return class extends React.Component {
    render() {
      return (
        <ScrollY>{y => <Component {...this.props} y={y} />}</ScrollY>
      );
    }
  };
}

const AppWithScrollY = withScrollY(App);

ReactDOM.render(
  <AppWithScrollY message="hello" />,
  document.getElementById("app")
);

```