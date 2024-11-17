import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Cronogramas } from '../../../models/Cronogramas';
import { CronogramasService } from '../../../services/cronogramas.service';
import { CursosUsuarios } from '../../../models/CursosUsuarios';
import { CursosUsuariosService } from '../../../services/cursos-usuarios.service';
import { Sesiones } from '../../../models/Sesiones';
import { SesionesService } from '../../../services/sesiones.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-creaeditacronogramas',
  standalone: true,
  providers:[provideNativeDateAdapter(),{provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatDatepickerModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './creaeditacronogramas.component.html',
  styleUrl: './creaeditacronogramas.component.css'
})

export class CreaeditacronogramasComponent implements OnInit{
 
  form:FormGroup= new FormGroup({})
  Cronogramas:Cronogramas=new Cronogramas()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false
  //Para traer los elementos
  listaCursosUsuarios: CursosUsuarios[] = [];
  listaSesiones: Sesiones[] = [];
  listaEstados:{value:string,viewValue:string}[]=[
    {value:'completado',viewValue:'completado'},
    {value:'no completado',viewValue:'no completado'}
  ];

  constructor(private formBuilder:FormBuilder,private cuS:CursosUsuariosService, private sS:SesionesService,private cS:CronogramasService,private router:Router, private route:ActivatedRoute){}
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
      hdetalle: ['',Validators.required],
      hfechaLimite: ['', Validators.required],
      hEstado: ['', Validators.required],
      hCursoUsuario: ['', Validators.required ],
      hSesiones: ['', Validators.required],
    })

    this.cuS.list().subscribe(data=>{
      this.listaCursosUsuarios=data
    })

    this.sS.list().subscribe(data=>{
      this.listaSesiones=data
    })
    
  }

  aceptar(){
    if(this.form.valid){
      //Para el modificar
      this.Cronogramas.id=this.form.value.hcodigo;
      this.Cronogramas.detalle=this.form.value.hdetalle;
      this.Cronogramas.fechaLimite=this.form.value.hfechaLimite;
      this.Cronogramas.estado=this.form.value.hEstado;
      this.Cronogramas.curUsu.id=this.form.value.hCursoUsuario;
      this.Cronogramas.ses.id=this.form.value.hSesiones;
     
      if(this.edicion){
        this.cS.update(this.Cronogramas).subscribe((data)=>{
          this.cS.list().subscribe((data)=>{
            this.cS.setList(data)
          })
        })
      }

      else{
        this.cS.insert(this.Cronogramas).subscribe((data)=>{
          this.cS.list().subscribe((data)=>{
            this.cS.setList(data)
          })
        }) 
      }

      this.router.navigate(['cronogramas'])
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
          hdetalle: new FormControl(data.detalle, Validators.required),
          hfechaLimite: new FormControl(data.fechaLimite, Validators.required),
          hEstado: new FormControl(data.estado, Validators.required),
          hCursoUsuario:new FormControl(data.curUsu.id, Validators.required),
          hSesiones:new FormControl(data.ses.id, Validators.required),
        })
        this.cuS.list().subscribe(data=>{
          this.listaCursosUsuarios=data
        })
        this.sS.list().subscribe(data=>{
          this.listaSesiones=data
        })
        
      })
    }
  }


}
