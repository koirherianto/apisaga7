/* eslint-disable prettier/prettier */
import { middleware } from './kernel.js'

const LandingController = () => import('#controllers/landing_controller')
const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const ProfileController = () => import('#controllers/profile_controllers')

import router from '@adonisjs/core/services/router'
router.on('/editor').renderInertia('home').as('editor.index')

router.get('/', [LandingController, 'index'])

router.group(() => {
    router.get('/register', [AuthController, 'registerView']).as('register')
    router.post('/register', [AuthController, 'register']).as('register.store')

    router.get('/login', [AuthController, 'loginView']).as('login')
    router.post('/login', [AuthController, 'login']).as('login.store')
}).middleware(middleware.guest())

router.group(() => {
    router.delete('/logout', [AuthController, 'logout']).as('logout')

    router.group(() => {
        // untuk user bisa mengedit data diri
        router.get('/profile', [ProfileController, 'index']).as('profile.index')
        router.put('/profile', [ProfileController, 'update']).as('profile.update')

        // untuk user bisa mengorganisir project nya sendiri
        router.resource('dashboard', DashboardController).as('dashboard')

    }).prefix('u')

    // jika url tidak lengkap arahkan page default
    router.group(() => {
        // router.get(':project', [RedirectController, 'project']).as('redirect.project')
        // router.get(':project/:version', [RedirectController, 'version']).as('redirect.version')
        // router.get(':project/:version/:topbar', [RedirectController, 'topbar']).as('redirect.topbar')
    })

    // :project/:version/:topbar/:page/editor
    // router.get(':project/:version/:topbar/:page/editor', [EditorController, 'index']).as('editor.index')
    
}).middleware(middleware.auth())

// default page
// router.get(':project/:version/:topbar/:page', [PageController, 'index']).as('page.index')