<template>
    <input :type="type" :placeholder="placeHolder" class="p-1 border-2 focus:outline-none focus:border-blue-600"
        :class="width"/>
</template>
<script setup>
import { ref } from 'vue';
const pops = defineProps({
    type: String,
    placeHolder: String,
    width: String
})

const width = ref("w-" + pops.width)

</script>
<style lang="">
    
</style>