import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router'

// экспортируем функцию фабрику для создания экземпляров
// нового приложения, маршрутизатора и хранилища
export function createApp () {
  const router = createRouter()

  const app = new Vue({
    router,
    // корневой экземпляр просто рендерит компонент App
    render: h => h(App)
  })
  return { app, router }
}
