import 'reflect-metadata';
import { installXOptions } from '@/x-components/plugin.options';
import { XInstaller } from '@empathy/x-components';
import Vue from 'vue';

Vue.config.productionTip = false;

new XInstaller(installXOptions);
