import Dialog from './dialog.es';
import axios from 'axios/dist/axios.min';

const DeleteConfirm = {
    mixins: [ Dialog ],
    methods: {
        deleteConfirm(data = {}, onSuccess = () => {}, onError) {
            this.openDialog({
                vue: {
                    data() {
                        return {
                            isLoading: false,
                            title: data.title,
                            body: data.body
                        }
                    },
                    methods: {
                        doDelete() {
                            this.isLoading = true;
                            axios.delete(data.deleteUrl, data.deleteOption).then(response => {
                                this.isLoading = false;
                                onSuccess(response.data.success, response.data.result);
                                this.dialog.close();
                            }).catch(error => {
                                this.isLoading = false;
                                if (typeof onError === 'function') {
                                    onError(error);
                                } else {
                                    console.log(error);
                                }
                            });
                        }
                    }
                },
                dialog: {
                    width: '500px',
                    showClass: {
                        popup: ''
                    },
                    hideCloseButton: true,
                    content: `
                        <div class="delete-confirm-wrapper">
                            <div class="deletion-title">
                                <b-icon-exclamation-triangle font-scale="2.5"></b-icon-exclamation-triangle>
                                <span>{{ title }}</span>
                            </div>
                            <div class="deletion-body">
                                {{ body }}
                            </div>
                            <div class="popup-footer">
                                <button
                                    class="btn btn-outline-primary mr-3"
                                    :disabled="isLoading"
                                    @click="dialog.close()"
                                >Cancel</button>
                                <button
                                    class="btn btn-danger"
                                    :disabled="isLoading"
                                    @click="doDelete"
                                >Yes, delete</button>
                            </div>
                        </div>
                    `
                }
            });
        }
    }
}

export default DeleteConfirm;