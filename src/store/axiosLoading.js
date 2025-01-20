import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('defineAxiosLoading', {
  state: () => {
    return {
      pageLoading: false
    }
  },
  actions: {
    setPageLoading(bool) {
      this.pageLoading = bool
    }
  }
})
