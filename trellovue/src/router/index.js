import { createRouter, createWebHistory } from 'vue-router'


import Crud from '../VIEWS/Crud'
import Edits from '../VIEWS/Edits'
import oneProject from '../VIEWS/oneProject'

const routes = [
    {
        path: '/tasks',
        name: 'TaskCrud',
        component: Crud
    },
    {
        path: '/',
        name: 'Home',
        component: Edits
    },
    {
        path: '/project/:id',
        name: 'Project',
        component: oneProject,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router