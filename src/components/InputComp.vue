<template>
    <input :type="type" :placeholder="placeHolder" class="p-1 focus:outline-none focus:border-blue-600"
        :class="customClass" v-model="model"/>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps({
    type: String,
    placeHolder: String,
    width: String,
    underline: Boolean
})

const model = defineModel()

const customClass = ref("")

if (props.underline) {
    customClass.value = customClass.value.concat(" border-b-2")
} else {
    customClass.value = customClass.value.concat(" border-2")
}

if (props.width != undefined || props.width != "") {
    customClass.value = customClass.value.concat(" w-").concat(props.width)
}

</script>
<style lang="">
    
</style>