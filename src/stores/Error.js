import { defineStore } from "pinia";

export const useErrorStore = defineStore('error', {
    state: () => ({
        isError: false
    }),
    getters: {

    },
    actions: {
        convertToTrue() {
            this.isError = true
        }
    }
})