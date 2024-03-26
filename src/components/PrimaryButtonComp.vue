<template lang="">
    <button type="button" class="border text-xl border-blue-600 bg-blue-600 text-white p-1 rounded"
        :class="customClass">{{ text }}</button>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
    text: String,
    width: String
})

const customClass = ref("")

if (props.width != undefined && props.width != "") {
    customClass.value = customClass.value.concat(" w-").concat(props.width)
}
</script>
<style lang="">
    
</style>