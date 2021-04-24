<template>
    <div class="dropdown-wrapper">
        <div
            :id="target"
            class="form-control dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
        >
            <span :class="{'placeholder': !selectedItem}">{{ getSelectedLabel }}</span>
        </div>
        <div class="dropdown-menu" :aria-labelledby="target">
            <div v-for="(item, index) in items" :key="index">
                <a class="dropdown-item unselectable" @click="change(item)">{{ item.value }}</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dropdown',
    props: {
        value: { Type: [Number, String], default: 0 },
        items: { type: Array, default: () => ([]) },
        placeholder: { type: String, default: '' },
        requiredItem: { type: Boolean, default: false }
    },
    data() {
        return {
            target: 'dropdown' + String(Math.random()).substring(2),
            selected: null
        }
    },
    computed: {
        selectedItem() {
            return this.selected || this.items.find(item => item.key == this.value);
        },
        getSelectedLabel() {
            return this.selectedItem ? this.selectedItem.value : this.placeholder;
        }
    },
    methods: {
        change(item) {
            this.selected = item;
            this.$emit('change', this.requiredItem ? item : item.key);
        }
    }
}
</script>