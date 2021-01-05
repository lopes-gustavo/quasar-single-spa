import Vue from 'vue'
import singleSpaVue from 'single-spa-vue'
import createApp from '../.quasar/app.js' // Dynamically created by Quasar CLI

function createDeferredPromise () {
  let resolveFn
  const deferredPromise = new Promise(resolve => { resolveFn = resolve })
  return { deferredPromise, resolveFn }
}

let asyncLifecyclesPromise
createApp().then(({ app }) => {
  const { deferredPromise, resolveFn } = createDeferredPromise()
  asyncLifecyclesPromise = deferredPromise

  const vueLifecycles = singleSpaVue({ Vue, appOptions: app })
  resolveFn(vueLifecycles)
})

export const mount = async () => asyncLifecyclesPromise.then(lifecycles => lifecycles.mount)
export const unmount = async () => asyncLifecyclesPromise.then(lifecycles => lifecycles.unmount)
export const bootstrap = async () => asyncLifecyclesPromise.then(lifecycles => lifecycles.bootstrap)
