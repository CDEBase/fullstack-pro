import * as React from 'react';
import { createRenderer } from 'fela';
import { render } from 'fela-dom';

const rule = props => ({
  fontSize: props.fontSize + 'px',
  color: 'red',
  ':hover': {
    color: 'blue',
    fontSize: props.fontSize + 2 + 'px'
  },
  '@media (min-height: 300px)': {
    backgroundColor: 'gray',
    ':hover': {
      color: 'black'
    }
  }
});

// Create renderer
const renderer = createRenderer();

// Store classname
const className = renderer.renderRule(rule, { fontSize: 12 });

// Write styles to a <style id="stylesheet"></style> node
render(renderer, document.getElementById('stylesheet'));

class Panel extends React.Component {
  render() {
    return(
      <div>        
        <p className={className}>This is Fela Node with dynamic classes</p>
      </div>
    );
  }
}

export default Panel;