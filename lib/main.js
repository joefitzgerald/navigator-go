'use babel'

import {CompositeDisposable} from 'atom'
import {Godef} from './godef'

export default {
  dependenciesInstalled: null,
  goconfig: null,
  goget: null,
  subscriptions: null,
  toolRegistered: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
    require('atom-package-deps').install('navigator-godef').then(() => {
      this.dependenciesInstalled = true
      return this.dependenciesInstalled
    }).catch((e) => {
      console.log(e)
    })
    this.godef = new Godef(
      () => { return this.getGoconfig() },
      () => { return this.getGoget() }
    )
    this.subscriptions.add(this.godef)
  },

  deactivate () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
    this.goget = null
    this.goconfig = null
    this.godef = null
    this.dependenciesInstalled = null
    this.toolRegistered = null
  },

  getGoconfig () {
    if (this.goconfig) {
      return this.goconfig
    }
    return false
  },

  getGoget () {
    if (this.goget) {
      return this.goget
    }
    return false
  },

  consumeGoconfig (service) {
    this.goconfig = service
  },

  consumeGoget (service) {
    this.goget = service
    this.registerTool()
  },

  registerTool () {
    if (this.toolRegistered || !this.goget) {
      return
    }
    this.subscriptions.add(this.goget.register('github.com/rogpeppe/godef'))
    this.toolRegistered = true
  }
}
