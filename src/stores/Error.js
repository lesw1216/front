import { defineStore } from "pinia";

export const useErrorStore = defineStore('error', {
    state: () => ({
        isError: false,
        errorMsg: undefined
    }),
    getters: {

    },
    actions: {
        createError(msg) {
            this.isError = true
            this.errorMsg = msg
        },
    }
})