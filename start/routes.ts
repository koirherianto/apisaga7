/* eslint-disable prettier/prettier */
import { middleware } from './kernel.js'

const LandingController = () => import('#controllers/landing_controller')
const AuthController = () => import('#controllers/auth_controller')

import router from '@adonisjs/core/services/router'
// router.on('/').renderInertia('home')

router.get('/', [LandingController, 'index'])


router.group(() => {
    router.get('/register', [AuthController, 'registerView']).as('register')
    router.post('/register', [AuthController, 'register']).as('register.store')

    router.get('/login', [AuthController, 'loginView']).as('login')
    router.post('/login', [AuthController, 'login']).as('login.store')
}).middleware(middleware.guest())


router.group(() => {
    router.delete('/logout', [AuthController, 'logout']) // no csrf
}).middleware(middleware.auth())