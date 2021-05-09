import Vue from 'vue/dist/vue.common.prod';
import SweetAlert2 from 'sweetalert2/dist/sweetalert2.min';

const Dialog = {
    methods: {
        openDialog(config) {
            config.dialog = config.dialog || {};

            SweetAlert2.fire({
                title: config.dialog.title,
                html: config.dialog.content,
                width: config.dialog.width,
                showCloseButton: !config.dialog.hideCloseButton,
                allowOutsideClick: false,
                showConfirmButton: false,
                showCancelButton: false,
                showClass: config.dialog.showClass || {popup: ''},
                hideClass: config.dialog.hideClass,
                customClass: config.dialog.customClass
            });

            const emptyFunction = () => {};
            const afterClose = config.dialog.afterClose || emptyFunction;

            config.vue = config.vue || {};
            config.vue.el = '#swal2-content';

            const vue = new Vue(config.vue);
            vue.dialog = {
                close: () => {
                    SweetAlert2.close();
                    afterClose();
                }
            }
        }
    }
}

export default Dialog;