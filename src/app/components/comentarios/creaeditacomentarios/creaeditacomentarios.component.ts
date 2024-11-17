import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Comentarios } from '../../../models/Comentarios';
import { Sesiones } from '../../../models/Sesiones';
import { Usuarios } from '../../../models/Usuarios';
import { SesionesService } from '../../../services/sesiones.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ComentariosService } from '../../../services/comentarios.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-creaeditacomentarios',
  standalone: true,
  providers:[provideNativeDateAdapter(),{provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatButtonModule,ReactiveFormsModule,CommonModule,MatDatepickerModule],
  templateUrl: './creaeditacomentarios.component.html',
  styleUrl: './creaeditacomentarios.component.css'
})
export class CreaeditacomentariosComponent implements OnInit{
  role: string = '';
  selectedUser: string = localStorage.getItem("username") ?? "";

  form:FormGroup= new FormGroup({})
  comentarios:Comentarios=new Comentarios()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false
  //Para traer los elementos de usuarios
  listaUsuarios: Usuarios[] = [];
  //Para traer los elementos de sesiones
  listaSesiones: Sesiones[] = [];

    constructor(private lS: LoginService,private formBuilder:FormBuilder,private cS:ComentariosService,private sS:SesionesService,private uS: UsuariosService, private router:Router, private route:ActivatedRoute){}
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
      hcomentario:['',Validators.required],
      hfecha: ['', Validators.required],
      hsesiones: ['',[Validators.required]],
      husuarios: ['',[Validators.required]]
    })
    this.sS.list().subscribe(data=>{
      this.listaSesiones=data
    });
    // Si no es admin, establecer hfecha a la fecha actual
    if (!this.isAdmin()) {
      const today = new Date();
      this.form.patchValue({
      hfecha: today // Establecer la fecha actual en el campo hfecha
      });
    }
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
      this.comentarios.id=this.form.value.hcodigo;
      this.comentarios.comentario=this.form.value.hcomentario;
      this.comentarios.fecha=this.form.value.hfecha;
      this.comentarios.ses.id=this.form.value.hsesiones;
      this.comentarios.usua.id=this.form.value.husuarios;
      if(this.edicion){
        this.cS.update(this.comentarios).subscribe((data)=>{
          this.cS.list().subscribe((data)=>{
            this.cS.setList(data)
          })
        })
      }
      else{
        this.cS.insert(this.comentarios).subscribe((data)=>{
          this.cS.list().subscribe(data=>{
            this.cS.setList(data)
          }) 
        }) 
      }
      this.router.navigate(['comentarios'])
    } 
    else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
    } 
    
  }

  //para el modificar
  init(){
    if(this.edicion){
      this.cS.listId(this.id).subscribe((data)=>{
        // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
        this.form=new FormGroup({

          hcodigo:new FormControl(data.id, Validators.required),
          hcomentario: new FormControl(data.comentario, Validators.required),
          hfecha: new FormControl(data.fecha,Validators.required),
          hsesiones: new FormControl(data.ses.id,Validators.required),
          husuarios: new FormControl(data.usua.id,Validators.required)
        })
        this.sS.list().subscribe(data=>{
          this.listaSesiones=data
        });
        if (!this.isAdmin()) {
          const today = new Date();
          this.form.patchValue({
          hfecha: today // Establecer la fecha actual en el campo hfecha
          });
        }
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
