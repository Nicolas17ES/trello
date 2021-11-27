import { createRouter, createWebHistory } from 'vue-router'

import Crud from '../VIEWS/Crud'

const routes = [
    {
        path: '/tasks',
        name: 'TaskCrud',
        component: Crud
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router