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
import { Videos } from '../../../models/Videos';
import { VideosService } from '../../../services/videos.service';
import { Sesiones } from '../../../models/Sesiones';
import { SesionesService } from '../../../services/sesiones.service';

@Component({
  selector: 'app-creaeditavideos',
  standalone: true,
  providers:[provideNativeDateAdapter(),{provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatDatepickerModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './creaeditavideos.component.html',
  styleUrl: './creaeditavideos.component.css'
})
export class CreaeditavideosComponent implements OnInit{
  form:FormGroup= new FormGroup({})
  videos:Videos=new Videos()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false
  //Para traer los elementos de sesiones
  listaSesiones: Sesiones[] = [];

  constructor(private formBuilder:FormBuilder,private vS:VideosService, private sS:SesionesService,private router:Router, private route:ActivatedRoute){}
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
      htitulo: ['', [Validators.required, Validators.maxLength(35)], [this.tituloRepetido.bind(this)]],
      hfecha: ['', Validators.required],
      hduracion: ['', [Validators.required, Validators.pattern('^[0-9]+\\.[0-9]{2}$'), Validators.maxLength(6)]],
      hurl: ['', [Validators.required, Validators.maxLength(20)], [this.tituloRepetido.bind(this)]],
      hsesion: ['', Validators.required],
    })
    this.sS.list().subscribe(data=>{
      this.listaSesiones=data
    })
    
  
  }
  aceptar(){
    if(this.form.valid){
      //Para el modificar
      this.videos.id=this.form.value.hcodigo;

      this.videos.titulo=this.form.value.htitulo;
      this.videos.fechaAgregado=this.form.value.hfecha;
      this.videos.duracion=this.form.value.hduracion;
      this.videos.url=this.form.value.hurl;
      this.videos.ses.id=this.form.value.hsesion;
     
      if(this.edicion){
        this.vS.update(this.videos).subscribe((data)=>{
          this.vS.list().subscribe((data)=>{
            this.vS.setList(data)
          })
        })
      }
      else{
        this.vS.insert(this.videos).subscribe((data)=>{
          this.vS.list().subscribe(data=>{
            this.vS.setList(data)
          }) 
        }) 
      }
      this.router.navigate(['videos'])
    } 
    else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
    } 
    
  }

  //para el modificar
  init(){
    if(this.edicion){
      this.vS.listId(this.id).subscribe((data)=>{
        // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
        this.form=new FormGroup({
          hcodigo:new FormControl(data.id, Validators.required),
          htitulo: new FormControl(data.titulo, [Validators.required, Validators.maxLength(35)], [this.tituloRepetido.bind(this)]),
          hfecha: new FormControl(data.fechaAgregado, Validators.required),
          hduracion: new FormControl(data.duracion, [Validators.required, Validators.pattern('^[0-9]+\\.[0-9]{2}$'), Validators.maxLength(6)]),
          hurl: new FormControl(data.url, [Validators.required, Validators.maxLength(20)]),
          hsesion:new FormControl(data.ses.id, Validators.required),
        })
        this.sS.list().subscribe(data=>{
          this.listaSesiones=data
        })
        
      })
    }
  }


  tituloRepetido(control: AbstractControl): Observable<ValidationErrors | null> {
    // Si el campo está vacío, se considera válido
    if (!control.value) {
        return of(null); // Retorna válido si el campo está vacío
    }

    // Llama a la lista de cursos y verifica si hay títulos repetidos
    return this.vS.list().pipe(
        map(videos => {
            // Compara títulos y excluye el curso en edición usando this.id
            const existe = videos.some(video => video.titulo === control.value && video.id != this.id);
            return existe ? { tituloRepetido: true } : null;
        })
    );
}
}
