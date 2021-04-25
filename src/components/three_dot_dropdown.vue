<template>
    <div class="dropdown-wrapper three-dop-wrapper">
        <span
            :id="target"
            class="dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
        >
            <b-icon-three-dots-vertical />
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