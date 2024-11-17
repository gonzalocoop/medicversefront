import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { CursosUsuarios } from '../../../models/CursosUsuarios';
import { CursosService } from '../../../services/cursos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Cursos } from '../../../models/Cursos';
import { Usuarios } from '../../../models/Usuarios';
import { CursosUsuariosService } from '../../../services/cursos-usuarios.service';


@Component({
  selector: 'app-creaeditacursosusuarios',
  standalone: true,
  providers:[provideNativeDateAdapter(),{provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatDatepickerModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './creaeditacursosusuarios.component.html',
  styleUrl: './creaeditacursosusuarios.component.css'
})
export class CreaeditacursosusuariosComponent implements OnInit{
  
  form:FormGroup= new FormGroup({})
  cursosUsuarios:CursosUsuarios=new CursosUsuarios()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false
  //Para traer los elementos de sesiones
  listaCursos: Cursos[] = [];
  listaUsuarios: Usuarios[] = [];
  listaEstados:{value:string,viewValue:string}[]=[
    {value:'completado',viewValue:'completado'},
    {value:'no completado',viewValue:'no completado'}
  ];


  constructor(private formBuilder:FormBuilder,private cuS:CursosUsuariosService, private cS:CursosService,private uS:UsuariosService,private router:Router, private route:ActivatedRoute){}
  ngOnInit(): void {
    //Para trabajar el editar
    this.route.params.subscribe((data:Params)=>{ //el  data['id'] es del id del parametro
      this.id=data['id'];
      this.edicion=data['id']!=null //Si el id es diferente de null, osea que se esta ingresando con un id, entonces el edicion se vuelve true
      
      //data de la tabla para mostrarla
      this.init();
    })

    this.form = this.formBuilder.group({
      hcodigo: [''], // para el modificar
      hprogreso: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{2})?$'), Validators.maxLength(6),Validators.max(100),]],
      hfechaInicio: ['', Validators.required],
      hfechaFinal: ['', Validators.required],
      hestado: ['', Validators.required ],
      hurl: ['', [Validators.required, Validators.maxLength(80)]],
      hcurso: ['', Validators.required],
      husuario: ['', Validators.required],
    })
    this.cS.list().subscribe(data=>{
      this.listaCursos=data
    })
    this.uS.list().subscribe(data=>{
      this.listaUsuarios=data
    })
    
  
  }
  aceptar(){
    if(this.form.valid){
      //Para el modificar
      this.cursosUsuarios.id=this.form.value.hcodigo;

      this.cursosUsuarios.progreso=this.form.value.hprogreso;
      this.cursosUsuarios.fechaInicio=this.form.value.hfechaInicio;
      this.cursosUsuarios.fechaFin=this.form.value.hfechaFinal;
      this.cursosUsuarios.estado=this.form.value.hestado;
      this.cursosUsuarios.url=this.form.value.hurl;
      this.cursosUsuarios.cur.id=this.form.value.hcurso;
      this.cursosUsuarios.usua.id=this.form.value.husuario;

     
      if(this.edicion){
        this.cuS.update(this.cursosUsuarios).subscribe((data)=>{
          this.cuS.list().subscribe((data)=>{
            this.cuS.setList(data)
          })
        })
      }
      else{
        this.cuS.insert(this.cursosUsuarios).subscribe((data)=>{
          this.cuS.list().subscribe(data=>{
            this.cuS.setList(data)
          }) 
        }) 
      }
      this.router.navigate(['cursosusuarios'])
    } 
    else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
    } 
    
  }

  //para el modificar
  init(){
    if(this.edicion){
      this.cuS.listId(this.id).subscribe((data)=>{
        // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
        this.form=new FormGroup({
          hcodigo:new FormControl(data.id, Validators.required),
          hprogreso: new FormControl(data.progreso, [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{2})?$'), Validators.maxLength(6),Validators.max(100),]),
          hfechaInicio: new FormControl(data.fechaInicio, Validators.required),
          hfechaFinal: new FormControl(data.fechaFin, Validators.required),
          hestado: new FormControl(data.estado, Validators.required),
          hurl: new FormControl(data.url, [Validators.required, Validators.maxLength(80)]),
          hcurso:new FormControl(data.cur.id, Validators.required),
          husuario:new FormControl(data.usua.id, Validators.required),
        })
        this.cS.list().subscribe(data=>{
          this.listaCursos=data
        })
        this.uS.list().subscribe(data=>{
          this.listaUsuarios=data
        })
        
      })
    }
  }


  
}
