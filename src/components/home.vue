<template>
    <div class="home-page-content">
        <menu-bar :hide-add-button="true"></menu-bar>
        <post-grid></post-grid>
    </div>
</template>

<script>
import MenuBar from './menu_bar';
import PostGrid from './post/post_grid';

export default {
    name: 'Home',
    components: {
        MenuBar,
        PostGrid
    }
}
</script>