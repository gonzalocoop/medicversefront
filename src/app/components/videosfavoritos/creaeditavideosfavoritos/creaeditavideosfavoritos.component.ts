import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { Videos } from '../../../models/Videos';
import { VideosService } from '../../../services/videos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuarios } from '../../../models/Usuarios';
import { VideosFavoritos } from '../../../models/VideosFavoritos';
import { VideosFavoritosService } from '../../../services/videosfavoritos.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-creaeditavideosfavoritos',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './creaeditavideosfavoritos.component.html',
  styleUrl: './creaeditavideosfavoritos.component.css'
})
export class CreaeditavideosfavoritosComponent implements OnInit {
  role: string = '';
  selectedUser: string = localStorage.getItem("username") ?? "";
 
  form:FormGroup= new FormGroup({})
  videosfavoritos:VideosFavoritos=new VideosFavoritos()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false

  //Para traer los elementos de videos
  listaVideos: Videos[] = [];
  //Para traer los elementos de usuarios
  listaUsuarios: Usuarios[] = [];


  constructor(private lS: LoginService,private formBuilder:FormBuilder,private fS:VideosFavoritosService,private vS:VideosService,private uS:UsuariosService, private router:Router, private route:ActivatedRoute){}
  ngOnInit(): void {
    this.role = this.lS.showRole();  // Aquí te aseguras de que el rol esté actualizado
    //Para trabajar el editar
    this.route.params.subscribe((data:Params)=>{ //el  data['id'] es del id del parametro
      this.id=data['id'];
      this.edicion=data['id']!=null //Si el id es diferente de null, osea que se esta ingresando con un id, entonces el edicion se vuelve true
      //data de la tabla para mostrarla
      this.init();
    })  

    this.form=this.formBuilder.group({
      hcodigo:[''], //para el modificar
      husuarios: ['', Validators.required],
      hvideos:['',Validators.required],
  
    },{ 
      asyncValidators: [this.videoFavoritoUnico.bind(this)] // Validación a nivel de formulario
    }
  );
    this.vS.list().subscribe(data=>{
      this.listaVideos=data
    });
    if (this.isAdmin()) {
      // Si es administrador, obtenemos todos los usuarios
      this.uS.list().subscribe(data => {
        this.listaUsuarios = data;
      });
    } else {
      // Si no es administrador, solo añadimos el usuario seleccionado
      this.uS.usuarioPorUsername(this.selectedUser).subscribe(data => {
        this.listaUsuarios = [data];
      });
    }
}
aceptar(){
  if(this.form.valid){
    //Para el modificar
    this.videosfavoritos.id=this.form.value.hcodigo;

    this.videosfavoritos.usu.id=this.form.value.husuarios;
    this.videosfavoritos.vid.id=this.form.value.hvideos;
   
    if(this.edicion){
      this.fS.update(this.videosfavoritos).subscribe((data)=>{
        this.fS.list().subscribe((data)=>{
          this.fS.setList(data)
        })
      })
    }
    else{
      this.fS.insert(this.videosfavoritos).subscribe((data)=>{
        this.fS.list().subscribe(data=>{
          this.fS.setList(data)
        }) 
      }) 
    }
    this.router.navigate(['videosfav'])
  } 
  else {
    // Marca todos los campos como tocados para mostrar errores
    this.form.markAllAsTouched();
  } 
  
}
 //para el modificar
 init(){
  if(this.edicion){
    this.fS.listId(this.id).subscribe((data)=>{
      // Marca todos los campos como tocados para mostrar errores
    this.form.markAllAsTouched();
      this.form=new FormGroup({
        hcodigo:new FormControl(data.id, Validators.required),
        husuarios: new FormControl(data.usu.id, Validators.required),
        hvideos: new FormControl(data.vid.id, Validators.required)
       
      },{ 
        asyncValidators: [this.videoFavoritoUnico.bind(this)] // Validación a nivel de formulario
      })
      this.vS.list().subscribe(data=>{
        this.listaVideos=data
      });
      if (this.isAdmin()) {
        // Si es administrador, obtenemos todos los usuarios
        this.uS.list().subscribe(data => {
          this.listaUsuarios = data;
        });
      } else {
        // Si no es administrador, solo añadimos el usuario seleccionado
        this.uS.usuarioPorUsername(this.selectedUser).subscribe(data => {
          this.listaUsuarios = [data];
        });
      }
    })
  }
}

videoFavoritoUnico(): Observable<ValidationErrors | null> {
  // Obtenemos los valores del formulario
  const usuarioId = this.form.get('husuarios')?.value;
  const videoId = this.form.get('hvideos')?.value;

  // Si faltan valores (por ejemplo, si el usuario o el video no se han seleccionado), consideramos válido
  if (!usuarioId || !videoId) {
    return of(null);
  }

  // Llamamos al servicio para obtener la lista de favoritos
  return this.fS.list().pipe(
    map(videosfavos => {
      // Verificamos si existe un favorito con el mismo usuario y video
      const existeVideoFavorito = videosfavos.some(videof =>
        videof.usu.id === usuarioId && videof.vid.id === videoId && videof.id != this.id
      );

      // Si existe, devolvemos un error, de lo contrario, retornamos null
      return existeVideoFavorito ? { usuarioYaTieneEseVideoFavorito: true } : null;
    }),
  );
}

verificar() {
  this.role = this.lS.showRole();
  return this.lS.verificar();
}
isAdmin() {
  return this.role === 'ADMINISTRADOR';
}

isStudent() {
  return this.role === 'ESTUDIANTE';
}

}