import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '@/views/login/index.vue'
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'login-view',
            component: () => import('@/views/login/index.vue')
        },
    ],
});

describe('LoginView', () => {
    it('renders the LoginView component', () => {
        const wrapper = mount(LoginView, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('#email').exists()).toBe(true);
        expect(wrapper.find('#password').exists()).toBe(true);
    });
});
