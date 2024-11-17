import { Routes } from '@angular/router';
import { CursosComponent } from './components/cursos/cursos.component';
import { CreaeditacursosComponent } from './components/cursos/creaeditacursos/creaeditacursos.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { NosotrosComponent } from './components/landingpage/nosotros/nosotros.component';
import { ServiciosComponent } from './components/landingpage/servicios/servicios.component';
import { PlanesComponent } from './components/landingpage/planes/planes.component';
import { ContactoComponent } from './components/landingpage/contacto/contacto.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { SuscripcionesComponent } from './components/suscripciones/suscripciones.component';
import { CreaeditasuscripcionesComponent } from './components/suscripciones/creaeditasuscripciones/creaeditasuscripciones.component';
import { RolesComponent } from './components/roles/roles.component';
import { CreaeditarolesComponent } from './components/roles/creaeditaroles/creaeditaroles.component';
import { VerdescripcionComponent } from './components/cursos/verdescripcion/verdescripcion.component';
import { SesionesComponent } from './components/sesiones/sesiones.component';
import { CreaeditasesionesComponent } from './components/sesiones/creaeditasesiones/creaeditasesiones.component';
import { VideosComponent } from './components/videos/videos.component';
import { CreaeditavideosComponent } from './components/videos/creaeditavideos/creaeditavideos.component';
import { VideosfavoritosComponent } from './components/videosfavoritos/videosfavoritos.component';
import { CreaeditavideosfavoritosComponent } from './components/videosfavoritos/creaeditavideosfavoritos/creaeditavideosfavoritos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CreaeditausuariosComponent } from './components/usuarios/creaeditausuarios/creaeditausuarios.component';
import { CursosusuariosComponent } from './components/cursosusuarios/cursosusuarios.component';
import { CreaeditacursosusuariosComponent } from './components/cursosusuarios/creaeditacursosusuarios/creaeditacursosusuarios.component';
import { UsuariossuscripcionesComponent } from './components/usuariossuscripciones/usuariossuscripciones.component';
import { CreaeditausuariossuscripcionesComponent } from './components/usuariossuscripciones/creaeditausuariossuscripciones/creaeditausuariossuscripciones.component';
import { CronogramasComponent } from './components/cronogramas/cronogramas.component';
import { CreaeditacronogramasComponent } from './components/cronogramas/creaeditacronogramas/creaeditacronogramas.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { CreaeditacomentariosComponent } from './components/comentarios/creaeditacomentarios/creaeditacomentarios.component';
import { VerdescripcionsesComponent } from './components/sesiones/verdescripcionses/verdescripcionses.component';
import { VercomentarioComponent } from './components/comentarios/vercomentario/vercomentario.component';
import { VercursosComponent } from './components/cursosusuarios/vercursos/vercursos.component';
import { IniciosesionComponent } from './components/iniciosesion/iniciosesion.component';
import { VervideosdesesionesComponent } from './components/cursosusuarios/vervideosdesesiones/vervideosdesesiones.component';
import { ObtenerurlComponent } from './components/cursosusuarios/obtenerurl/obtenerurl.component';
import { VerdetallecronoComponent } from './components/cronogramas/verdetallecrono/verdetallecrono.component';
import { VercomentariodesesionComponent } from './components/cursosusuarios/vercomentariodesesion/vercomentariodesesion.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { TiempopromedioComponent } from './components/reportes/tiempopromedio/tiempopromedio.component';
import { ContabilizarsesionesComponent } from './components/reportes/contabilizarsesiones/contabilizarsesiones.component';
import { TituloduracionvideosComponent } from './components/reportes/tituloduracionvideos/tituloduracionvideos.component';
import { UsuariosdesuscripcionesComponent } from './components/reportes/usuariosdesuscripciones/usuariosdesuscripciones.component';
import { Top3cursosComponent } from './components/reportes/top3cursos/top3cursos.component';
import { RecaudaciontotalsuscripcionComponent } from './components/reportes/recaudaciontotalsuscripcion/recaudaciontotalsuscripcion.component';
import { CursoscompletadosynocompletadosComponent } from './components/reportes/cursoscompletadosynocompletados/cursoscompletadosynocompletados.component';
import { CursosmasymenossuscripcionesdeusuariosComponent } from './components/reportes/cursosmasymenossuscripcionesdeusuarios/cursosmasymenossuscripcionesdeusuarios.component';
import { ComentariosnegativosComponent } from './components/reportes/comentariosnegativos/comentariosnegativos.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { HomeComponent } from './components/home/home.component';
import { Top5cursoscantsesionescategoriasesionesComponent } from './components/reportes/top5cursoscantsesionescategoriasesiones/top5cursoscantsesionescategoriasesiones.component';
import { CantidadgeneralcursosusuarioscompletadosComponent } from './components/reportes/cantidadgeneralcursosusuarioscompletados/cantidadgeneralcursosusuarioscompletados.component';
import { RegistrarestudianteComponent } from './components/registrarestudiante/registrarestudiante.component';

export const routes: Routes = [
    {
        path: '', // Ruta vacía para redirigir
        redirectTo: '/landing', // Redirige a la página de inicio
        pathMatch: 'full' // Asegúrate de que coincida con toda la ruta
    },
    {
        path: 'landing', component: LandingpageComponent, // Ruta principal que carga la landing page
        children:[
            {
                path:'nosotros', component:NosotrosComponent
            },
            {
                path:'servicios',component:ServiciosComponent
            },
            {
                path:'planes',component:PlanesComponent
            },
            {
                path:'contacto',component:ContactoComponent
            },
        ]
    },
    {
        path:'cursos',component:CursosComponent,
        children:[
            {
                path:'nuevo', component:CreaeditacursosComponent
            },
            {
                path:'ediciones/:id',component:CreaeditacursosComponent
            },
            {
                path:'descripciones/:id',component:VerdescripcionComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'suscripciones',component:SuscripcionesComponent,
        children:[
            {
                path:'nuevo', component:CreaeditasuscripcionesComponent
            },
            {
                path:'ediciones/:id',component:CreaeditasuscripcionesComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'roles',component:RolesComponent,
        children:[
            {
                path:'nuevo', component:CreaeditarolesComponent
            },
            {
                path:'ediciones/:id',component:CreaeditarolesComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'sesiones',component:SesionesComponent,
        children:[
            {
                path:'nuevo', component:CreaeditasesionesComponent
            },
            {
                path:'ediciones/:id',component:CreaeditasesionesComponent
            },
            {
                path:'descripciones/:id',component:VerdescripcionsesComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'videos',component:VideosComponent,
        children:[
            {
                path:'nuevo', component:CreaeditavideosComponent
            },
            {
                path:'ediciones/:id',component:CreaeditavideosComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'videosfav',component:VideosfavoritosComponent,
        children:[
            {
                path:'nuevo', component:CreaeditavideosfavoritosComponent
            },
            {
                path:'ediciones/:id',component:CreaeditavideosfavoritosComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'usuarios',component:UsuariosComponent,
        children:[
            {
                path:'nuevo', component:CreaeditausuariosComponent
            },
            {
                path:'ediciones/:id',component:CreaeditausuariosComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'cursosusuarios',component:CursosusuariosComponent,
        children:[
            {
                path:'nuevo', component:CreaeditacursosusuariosComponent
            },
            {
                path:'ediciones/:id',component:CreaeditacursosusuariosComponent
            },
            {
                path:'vercursos/:id',component:VercursosComponent,
                
            },
            {
                path: 'vervideos/:idCursoUsuario/:idSesion', component: VervideosdesesionesComponent 
            },
            {
                path: 'obtenerurl/:idCursoUsuario', component: ObtenerurlComponent 
            },
            {
                path: 'vercomentses/:idCursoUsuario/:idSesion', component: VercomentariodesesionComponent 
            }

        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'usuariossuscripciones',component:UsuariossuscripcionesComponent,
        children:[
            {
                path:'nuevo', component:CreaeditausuariossuscripcionesComponent
            },
            {
                path:'ediciones/:id',component:CreaeditausuariossuscripcionesComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'cronogramas',component:CronogramasComponent,
        children:[
            {
                path:'nuevo', component:CreaeditacronogramasComponent
            },
            {
                path:'ediciones/:id',component:CreaeditacronogramasComponent
            },
            {
                path:'verdetallecrono/:id',component:VerdetallecronoComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'comentarios',component:ComentariosComponent,
        children:[
            {
                path:'nuevo', component:CreaeditacomentariosComponent
            },
            {
                path:'ediciones/:id',component:CreaeditacomentariosComponent
            },
            {
                path:'vercoment/:id',component:VercomentarioComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'video',component:VideoPlayerComponent,
    },
    {
        path:'iniciosesion',component:IniciosesionComponent,
    },
    {
        path:'registrarestudiante',component:RegistrarestudianteComponent,
    },
    {
        path:'reportes',component:ReportesComponent,
        children:[
            {
                path:'tiempopromedio', component:TiempopromedioComponent
            },
            {
                path:'contabilizarsesiones',component:ContabilizarsesionesComponent
            },
            {
                path:'tituloduracion',component:TituloduracionvideosComponent
            },
            {
                path:'usuariossuscripcion',component:UsuariosdesuscripcionesComponent
            },
            {
                path:'top3cursos',component:Top3cursosComponent
            },
            {
                path:'recaudaciontotal',component:RecaudaciontotalsuscripcionComponent
            },
            {
                path:'cursoscynoc',component:CursoscompletadosynocompletadosComponent
            },
            {
                path:'cursosmasymenossucrip',component:CursosmasymenossuscripcionesdeusuariosComponent
            },
            {
                path:'comentariosnegativos',component:ComentariosnegativosComponent
            },
            {
                path:'top5cursosesiones',component:Top5cursoscantsesionescategoriasesionesComponent
            },
            {
                path:'porcentajeGeneralCursosUsuarios',component:CantidadgeneralcursosusuarioscompletadosComponent
            }
            
        ],
        canActivate: [seguridadGuard],
    },
    {
      path: 'homes',
      component: HomeComponent,
      canActivate: [seguridadGuard], 
    }
    
];
