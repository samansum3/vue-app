<template>
    <div v-if="isLoading" class="loading-overlay" :class="cssClass">
        <spinner :css-class="spinnerClass"></spinner>
    </div>
</template>

<script>
export default {
    name: 'Loading Indicator',
    props: {
        cssClass: {type: String, default: ''},
        spinnerClass: {type: String, default: ''},
        isLoading: {type: Boolean, default: false}
    }
}
</script>