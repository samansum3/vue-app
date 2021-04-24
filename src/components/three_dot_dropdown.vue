<template>
    <div class="dropdown-wrapper three-dop-wrapper">
        <span
            :id="target"
            class="dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
        </span>
        <div class="dropdown-menu dropdown-menu-right" :aria-labelledby="target">
            <div v-for="(item, index) in items" :key="index">
                <a class="dropdown-item unselectable px-3" @click="$emit('action', item.key)">{{ item.value }}</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Three dot dropdown",
    props: {
        items: {type: Array, default: () => ([])}
    },
    data() {
        return {
            target: 'dropdown-'.concat(String(Math.random()).substring(2))
        }
    }
}
</script>