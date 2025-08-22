<template>
    <span>
        <span id="toggle-success">
            <svg width="0" height="0">
                <radialGradient id="rg" r="150%" cx="30%" cy="107%">
                    <stop stop-color="#DB4144" offset="0"/>
                    <stop stop-color="#EB6650" offset="0.9"/>
                </radialGradient>
            </svg>
            <font-awesome-icon v-if="toggled" :icon="['fa', 'toggle-on']" size="lg" @click="toggled = !toggled" class="fa-success"/>
        </span>
        <span id="toggle-error">
            <font-awesome-icon v-if="!toggled" :icon="['fa', 'toggle-off']" size="lg" @click="toggled = !toggled"/>
        </span>
    </span>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

library.add(faToggleOn);
library.add(faToggleOff);
export default {
    name: 'ToggleSwitch',
    props: ['toggled', 'label']
};
</script>

<style lang="scss" scoped>
    .fa-toggle-on {
        font-size: 25px;
        cursor: pointer;
    }

    .fa-toggle-off {
        font-size: 25px;
        cursor: pointer;
    }

    #toggle-success > svg * {
        fill: url(#rg);
    }
    #toggle-error > svg * {
        color: #B4B4B4;
    }
</style>
