<template>
    <div v-show="isError" class="text-red-500 text-xs font-semibold mb-2">
        {{ message }}
    </div>
</template>
<script setup>
const props = defineProps({
    message: String,
    isError: Boolean,
})

</script>
<style lang="">
    
</style>