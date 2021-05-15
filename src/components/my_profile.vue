<template>
    <div class="my-profile-wrapper">
        <menu-bar
            :hideSearchBox="true"
            :hideAddButtonIcon="true"
            addButtonText="Save"
            addButtonTextClass="px-4"
            @onCreate="saveProfileInfo"
        ></menu-bar>
        <div class="manager-page-wrapper">
            <div class="card-container container-1280 position-relative">
                <div class="candy-card my-profile row shadow-none">
                    <div class="col-3 left-side-bar">
                        <div class="avatar-wrapper">
                            <img :src="user.avatar" alt="User avatar" class="avatar">
                            <div class="camera-wrapper" @click="changeProfileImage">
                                <b-icon-camera font-scale="1.5" class="camera-icon"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-9 user-info">
                        <div calss="form-body">
                            <div class="row group-control">
                                <div class="col-6">
                                    <label>First name</label>
                                    <input type="text" placeholder="First name" class="form-control" v-model="user.firstName" />
                                    <span class="error-message" v-if="$v.user.firstName.$error">Please input first name</span>
                                </div>
                                <div class="col-6">
                                    <label>Last name</label>
                                    <input type="text" placeholder="Last name" class="form-control" v-model="user.lastName" />
                                    <span class="error-message" v-if="$v.user.lastName.$error">Please input last name</span>
                                </div>
                            </div>
                            <div class="row group-control">
                                <div class="col-12">
                                    <label>Email address</label>
                                    <input type="text" placeholder="Email address" class="form-control" v-model="user.emailAddress" />
                                    <span class="error-message" v-if="$v.user.emailAddress.$error">Please input email address</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <loading-indicator :is-loading="isLoading" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios/dist/axios.min';
import MenuBar from './menu_bar';
import { required, email } from 'vuelidate/dist/validators.min';
import ImageCropper from '../mixins/image_cropper';
import LoadingIndicator from './loading_indicator';

import '../css/components/my_profile.scss';

export default {
    name: 'MyProfile',
    mixins: [
        ImageCropper
    ],
    components: {
        MenuBar,
        LoadingIndicator
    },
    data: function() {
        return {
            isLoading: true,
            profileImage: null,
            user: {}
        }
    },
    validations: {
        user: {
            firstName: { required },
            lastName: { required },
            emailAddress: { required, email }
        }
    },
    created: function() {
        this.getUserProfile();
    },
    methods: {
        getUserProfile: function() {
            this.isLoading = true;
            axios.get('/api/user/get-profile').then(response => {
                this.isLoading = false;
                if (response.data.success) {
                    this.user = response.data.result;
                }
            }).catch(error => {
                this.isLoading = false;
                console.error(error);
            })
        },
        saveProfileInfo: function() {
            this.$v.user.$touch();
            if (this.$v.user.$error) {
                return;
            }
            this.isLoading = true;

            const formData = new FormData();
            formData.append('uid', this.user.uid);
            formData.append('firstName', this.user.firstName);
            formData.append('lastName', this.user.lastName);
            formData.append('emailAddress', this.user.emailAddress);
            
            if (this.profileImage) {
                formData.append('avatar', this.profileImage);
            }
            axios.post('/api/user/update-profile', formData).then(response => {
                this.isLoading = false
                if (response.data.success) {
                    this.profileImage = null;
                }
            }).catch(error => {
                this.isLoading = false;
                console.error(error);
            });
        },
        changeProfileImage: function() {
            this.openCropperTool({
                imageUrl: this.user.avatar,
                popupOption: {
                    width: '450px',
                    title: 'Edit Profile Picture'
                },
                cropOption: {
                    boundary: { width: 400, height: 400 },
                    viewport: { width: 350, height: 350, type: 'circle' },
                    type: 'blob',
                    imageSize: { width: 400, height: 400 },
                    format: 'png',
                    circle: true
                }
            }, image => {
                this.profileImage = image;
                this.user.avatar = URL.createObjectURL(image);
            });
        }
    }
}
</script>