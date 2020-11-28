const Welcome = () => import('../../components/Welcome.vue');

export default [
  {
    path: '/',
    component: Welcome,
    meta: {
      dataLayer: {
        pageType: 'Main',
      },
      ad: {
        pageType: 'home',
      },
    },
  },
];
