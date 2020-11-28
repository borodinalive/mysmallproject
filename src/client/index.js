import {createApp} from '@root/app.js';
// import {Cookies} from './lib/cookie.js';

const APP = createApp();
// global.cookies = new Cookies({env: 'browser'});
global.APP = APP;

if (window.__INITIAL_STATE__) {
  APP.Store.replaceState(window.__INITIAL_STATE__);
}

// const token = cookies.get('token');
// if (typeof token === 'string') {
//   APP.API.BGLN.Request.defaults.headers.common['Authorization'] = token;
// }


APP.Router.onReady(() => {
  // Check auth token in URL
  // const token = APP.Router.currentRoute.query.token;
  // if (typeof token !== 'undefined') {
  //   APP.API.BGLN.Request.defaults.headers.common['Authorization'] = token;
  // }
  APP.Router.beforeResolve((to, from, next) => {
    const matched = APP.Router.getMatchedComponents(to);
    const prevMatched = APP.Router.getMatchedComponents(from);
    let diffed = false;

    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c));
    });

    if (activated.length === 0) {
      return next();
    }

    Promise.all(activated.map((component) => {
      if (typeof component.asyncData === 'function') {
        return component.asyncData({
          store: APP.Store,
          route: to,
        });
      }
    })).then(() => {
      next();
    }).catch(next);
  });

  // Redirect to 500 err page
  if (APP.Store.state.ui.asyncFail === true) {
    APP.Router.push('/500');
  }
  // Start app
  APP.Vue.$mount('#app');
});
