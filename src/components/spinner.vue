<template>
    <span class="spinner-border spinner-border-sm" :class="cssClass" role="status" aria-hidden="true"></span>
</template>

<script>
export default {
    name: 'Spinner',
    props: {
        cssClass: {type: String, default: ''}
    }
}
</script>