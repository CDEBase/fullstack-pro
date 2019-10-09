import { createRenderer, IRenderer } from 'fela';
import webPreset from 'fela-preset-web';

export default () => {
  const renderer = createRenderer({
    plugins: [
      ...webPreset,
    ],
    devMode: process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : false,
  });
  renderer.renderStatic(
    `
        html, body, #demo, .content{
            height: 100%;
          }
          body {
            background-color: #fff;
            color: #ccc;
            padding: 0;
            margin: 0;
            font-family: sans-serif;
            font-size: 13px;
          }
          div, a {
            outline: none !important;
          }
          a {
            text-decoration: none;
            cursor: pointer;
          }
          footer {
            position:fixed;
            bottom: 0;
            left: 0;
            right:0;
            height: 20px;
            background: #007acc;
          }
          footer > .container {
            padding: 2px;
          }
          #content {
            height: calc(100vh - 20px);
          }
          #container {
            height: 100%;
          }
          .editor-container {
            height: 100%;
            overflow: hidden;
          }
          .error {
            color: orangered;
          }
        `,
  );

  return renderer;
};

