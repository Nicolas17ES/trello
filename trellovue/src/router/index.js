import { createRouter, createWebHistory } from 'vue-router'


import Crud from '../VIEWS/Crud'
import Edits from '../VIEWS/Edits'

const routes = [
    {
        path: '/tasks',
        name: 'TaskCrud',
        component: Crud
    },
    {
        path: '/edits',
        name: 'Edits',
        component: Edits
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router