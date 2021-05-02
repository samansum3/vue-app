import Vue from 'vue/dist/vue.common.prod';
import VueCroppie from 'vue-croppie/dist/vue-croppie.min';
import Dialog from './dialog.es';

import 'croppie/croppie.css';

Vue.use(VueCroppie);

const ImageCropper = {
    mixins: [Dialog],
    methods: {
        openCropperTool(data = {}, onCrop = () => {}) {
            this.openDialog({
                vue: {
                    data() {
                        return {
                            option: data.cropOption
                        }
                    },
                    mounted() {
                        this.$refs.croppieRef.bind({
                            url: data.imageUrl,
                        });
                    },
                    methods: {
                        crop() {
                            let options = {
                                type: data.cropOption.type,
                                size: data.cropOption.imageSize,
                                format: data.cropOption.format
                            };

                            this.$refs.croppieRef.result(options, output => {
                                onCrop(output);
                            });
                        }
                    }
                },
                dialog: {
                    width: data.popupOption.width,
                    showClass: {
                        popup: ''
                    },
                    hideCloseButton: true,
                    content: `
                        <div class="vue-croppie-wrapper">
                            <vue-croppie
                                ref="croppieRef"
                                :boundary="option.boundary"
                                :viewport="option.viewport"
                            ></vue-croppie>
                            
                            <div class="popup-footer">
                                <button class="btn btn-outline-primary mr-3" @click="dialog.close()">Cancel</button>
                                <button class="btn btn-primary" @click="crop">Crop</button>
                            </div>
                        </div>
                    `
                }
            });
        }
    }
}

export default ImageCropper;