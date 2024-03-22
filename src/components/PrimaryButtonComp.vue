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

const width = ref("w-" + props.width)

const customClass = ref("")

customClass.value = customClass.value.concat(width.value)
</script>
<style lang="">
    
</style>