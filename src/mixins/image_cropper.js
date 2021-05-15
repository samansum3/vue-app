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
                        this.changeImage(data.imageUrl);
                        const sliderWrapper = document.getElementsByClassName('cr-slider-wrap')[0];
                        const rotations = document.getElementsByClassName('rotation-wrapper')[0];
                        if (sliderWrapper && rotations) {
                            sliderWrapper.append(rotations);
                        }
                    },
                    methods: {
                        crop() {
                            let options = {
                                type: data.cropOption.type,
                                size: data.cropOption.imageSize,
                                format: data.cropOption.format,
                                circle: !!data.cropOption.circle
                            };

                            this.$refs.croppieRef.result(options, output => {
                                onCrop(output);
                                this.dialog.close();
                            });
                        },
                        selectImage: function() {
                            document.getElementById('cropie-image').click();
                        },
                        change: function() {
                            const image = this.$refs.image.files[0];
                            this.changeImage(URL.createObjectURL(image));
                        },
                        changeImage: function(imageUrl) {
                            this.$refs.croppieRef.bind({
                                url: imageUrl
                            });
                        },
                        rotate: function(agnle) {
                            this.$refs.croppieRef.rotate(agnle);
                        }
                    }
                },
                dialog: {
                    width: data.popupOption.width,
                    title: data.popupOption.title,
                    hideCloseButton: !data.popupOption.title,
                    content: `
                        <div class="vue-croppie-wrapper show-border">
                            <vue-croppie
                                ref="croppieRef"
                                :boundary="option.boundary"
                                :viewport="option.viewport"
                            ></vue-croppie>
                            <div class="rotation-wrapper user-select-none">
                                <b-icon-arrow-counterclockwise font-scale="1.5" class="cursor-pointer" @click="rotate(90)"></b-icon-arrow-counterclockwise>
                                <b-icon-arrow-clockwise font-scale="1.5" class="cursor-pointer" @click="rotate(-90)"></b-icon-arrow-clockwise>
                            </div>

                            <input type="file" id="cropie-image" ref="image" class="d-none" @change="change" />
                            <div class="popup-footer">
                                <button class="btn btn-outline-primary mr-3" @click="selectImage">Change</button>
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