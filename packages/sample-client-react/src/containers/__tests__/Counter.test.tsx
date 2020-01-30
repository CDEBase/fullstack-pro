// import 'jest';
// import * as React from 'react';
// import { shallow, mount } from 'enzyme';
// import * as Sinon from 'sinon';
// import * as TestUtils from 'react-dom/test-utils';
// import { createStore, combineReducers } from 'redux';
// import configureStore from 'redux-mock-store';
// import { Counter } from '../Counter';
// import { reducers, Store } from '@sample-stack/client-state';
// import { Provider } from 'react-redux';
// import './setup';


// describe('components/Counter', () => {
//   it('renders', () => {
//     const store: any = createStore(combineReducers<Store.Sample>(reducers));

//     expect(shallow(
//       <Counter label="a counter!" store={store} />,
//     ).shallow()).toMatchSnapshot();
//   });

//   describe('COUNTER --- react-redux clicking "increment"', () => {
//     let counter;
//     let store;

//     beforeEach(() => {
//       store = createStore(combineReducers(reducers));
//       counter = mount(
//         <Provider store={store}>
//           <Counter label="a counter!'" />
//         </Provider>,
//       );
//     });


//     it('+++ check Props after increments counter', () => {
//       const increment = counter.find('button').first();
//       increment.simulate('click');
//       increment.simulate('click');
//       increment.simulate('click');


//       const getText = () => counter.find('pre').text();
//       expect(JSON.parse(getText()).counter.value).toBe(3);

//     });
//   });
// });
