import axios from 'axios/dist/axios.min';
import { required } from 'vuelidate/dist/validators.min';
import Dialog from './dialog.es';
import Vue from 'vue/dist/vue.common.prod';
import VueCroppie from 'vue-croppie/dist/vue-croppie.min';

import 'croppie/croppie.css';

Vue.use(VueCroppie);

const POST_STATUS = {
    publish: 0,
    draft: 1
}

const CratePost = {
    mixins: [Dialog],
    methods: {
        openCreatePostPopup(callback = () => {}, post) {
            const isUpdate = !!post;

            this.openDialog({
                vue: {
                    data() {
                        return {
                            post: {
                                title: '',
                                description: '',
                                status: POST_STATUS.publish,
                                featureImage: null
                            },
                            isLoading: false,
                            isUpdate: isUpdate,
                            selectedFile: null,
                            cropieOption: {
                                boundary: { width: 738, height: 369 },
                                viewport: { width: 688, height: 319, type:'square' }
                            }
                        }
                    },
                    validations: {
                        post: {
                            title: { required },
                            description: { required },
                            status: { required }
                        }
                    },
                    mounted() {
                        this.$nextTick(() => {
                            const croppieControl = document.getElementsByClassName('cr-slider-wrap')[0];
                            const imageSelector = document.getElementById('imageSelector');
                            croppieControl.classList.add('d-flex');
                            croppieControl.appendChild(imageSelector);
                        });
                    },
                    methods: {
                        async createPost() {
                            this.$v.post.$touch();
                            if (this.$v.post.$error) return;

                            try {
                                this.isLoading = true;
                                this.post.featureImage = await this.cropImage();
                                axios.post('/api/post/create', this.post).then(response => {
                                    this.isLoading = false;
                                    if (response.data.success) {
                                        callback(response.data.result);
                                        this.dialog.close();
                                    }
                                }).catch(error => {
                                    this.isLoading = false;
                                    console.error(error);
                                });
                            } catch(error) {
                                this.isLoading = false;
                                console.error(error);
                            }
                        },
                        selectImage() {
                            this.selectedFile = this.$refs.featureImage.files[0];
                            this.$refs.featureImageCroppieRef.bind({
                                url: URL.createObjectURL(this.selectedFile)
                            });
                        },
                        cropImage() {
                            return new Promise(resolve => {
                                this.$refs.featureImageCroppieRef.result({
                                    type: 'blob',
                                    size: { width: 1000, height: 500 },
                                    format: 'jpeg'
                                }, resolve);
                            });
                        }
                    }
                },
                dialog: {
                    title: 'New post'.toUpperCase(),
                    width: '800px',
                    showClass: {
                        popup: ''
                    },
                    content: `
                        <template>
                            <div class="create-post-wrapper container pt-4">
                                <vue-croppie
                                    ref="featureImageCroppieRef"
                                    :boundary="cropieOption.boundary"
                                    :viewport="cropieOption.viewport"
                                ></vue-croppie>

                                <div class="row group-control pt-2">
                                    <div class="col-12">
                                        <input type="text" placeholder="Title" class="form-control" v-model="post.title" />
                                        <span class="error-message" v-if="$v.post.title.$error">Please input post title</span>
                                    </div>
                                </div>

                                <div class="row group-control">
                                    <div class="col-12">
                                        <textarea
                                            rows="5"
                                            cols="50"
                                            class="form-control"
                                            placeholder="Description"
                                            v-model="post.description"
                                        ></textarea>
                                        <span class="error-message" v-if="$v.post.description.$error">Please input description</span>
                                    </div>
                                </div>

                                <div class="popup-footer">
                                    <button
                                        class="btn btn-outline-primary mr-3"
                                        :disabled="isLoading"
                                        @click="dialog.close()"
                                    >Cancel</button>
                                    <button
                                        class="btn btn-primary"
                                        :disabled="isLoading"
                                        @click="createPost"
                                    >
                                        <spinner v-if="isLoading"></spinner>
                                        <span>{{ isUpdate ? 'Update' : 'Create' }}</span>
                                    </button>
                                </div>
                            </div>

                            <input type="file" id="featureImageInput" class="d-none" ref="featureImage" @change="selectImage"></input>
                            <b-icon-image
                                id="imageSelector"
                                class="croppie-image-icon" scale="1.5"
                                @click="document.getElementById('featureImageInput').click()"
                            ></b-icon-image>
                        </template>
                    `
                }
            });
        }
    }
}

export default CratePost;