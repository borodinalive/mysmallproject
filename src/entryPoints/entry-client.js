import { createApp } from '../index'

// Специфичная для клиента логика загрузки...

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})
