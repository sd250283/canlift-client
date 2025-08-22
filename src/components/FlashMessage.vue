<template>
    <b-alert class="position-absolute" id="message" :variant="type" fade dismissible :show="flashMessage.dismissCountDown" @dismissed="flashMessage.dismissCountDown=0" @dismiss-count-down="countDownChanged">{{ flashMessage.text }}</b-alert>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'FlashMessage',
    data () {
        return {
            dismissSecs: 5
        };
    },
    computed: {
        ...mapGetters(['flashMessage']),
        type () {
            return this.flashMessage.type;
        }
    },
    methods: {
        countDownChanged (dismissCountDown) {
            this.flashMessage.dismissCountDown = this.dismissSecs;
        }
    }
};
</script>

<style scoped>
#message{
    z-index: 1051;
    left: 32%
}
</style>
