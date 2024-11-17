import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
//para el input de escrbir nombre
import {MatInputModule} from '@angular/material/input';
//para el combo box
import {MatSelectModule} from '@angular/material/select';

//para el uso de boton
import {MatButtonModule} from '@angular/material/button';
//form builder -> validacion de campos, FormGroup -> para los grupos, ReactiveFormsModule -> para trabajar con el formulario y que reconzoca sus elementos, Validator ->para la validacion
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
//Para el model y el service
import { Sesiones } from '../../../models/Sesiones';
import { SesionesService } from '../../../services/sesiones.service';
//Para rutear a otro componente
import { ActivatedRoute, Params, Router } from '@angular/router';
//para el if que se usa en errores en este caso
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule

import { map, Observable, of, startWith } from 'rxjs';
import { Cursos } from '../../../models/Cursos';
import { CursosService } from '../../../services/cursos.service';



@Component({
  selector: 'app-creaeditasesiones',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './creaeditasesiones.component.html',
  styleUrl: './creaeditasesiones.component.css'
})
export class CreaeditasesionesComponent implements OnInit{
  form:FormGroup= new FormGroup({})
  sesion:Sesiones=new Sesiones()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false
  //Para traer los elementos de dispositivos
  listaCursos: Cursos[] = [];
  

  constructor(private formBuilder:FormBuilder,private sS:SesionesService,private cS: CursosService, private router:Router, private route:ActivatedRoute){}
  ngOnInit(): void {
    //Para trabajar el editar
    this.route.params.subscribe((data:Params)=>{ //el  data['id'] es del id del parametro
      this.id=data['id'];
      this.edicion=data['id']!=null //Si el id es diferente de null, osea que se esta ingresando con un id, entonces el edicion se vuelve true
      //data de la tabla para mostrarla
      this.init();
    })
    


    this.form=this.formBuilder.group({
      hcodigo:[''], //para el modificar
      htitulo: ['', [Validators.required, Validators.maxLength(25)],[this.tituloRepetido.bind(this)]],
      hdescripcion:['',Validators.required],
      hcurso: ['',[Validators.required]]
    })
    this.cS.list().subscribe(data=>{
      this.listaCursos=data
    })
    
  }
  aceptar(){
    if(this.form.valid){
      //Para el modificar
      this.sesion.id=this.form.value.hcodigo;
      this.sesion.titulo=this.form.value.htitulo;
      this.sesion.descripcion=this.form.value.hdescripcion;
      this.sesion.cur.id=this.form.value.hcurso;
      if(this.edicion){
        this.sS.update(this.sesion).subscribe((data)=>{
          this.sS.list().subscribe((data)=>{
            this.sS.setList(data)
          })
        })
      }
      else{
        this.sS.insert(this.sesion).subscribe((data)=>{
          this.sS.list().subscribe(data=>{
            this.sS.setList(data)
          }) 
        }) 
      }
      this.router.navigate(['sesiones'])
    } 
    else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
    } 
    
  }

  //para el modificar
  init(){
    if(this.edicion){
      this.sS.listId(this.id).subscribe((data)=>{
        // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
        this.form=new FormGroup({
          hcodigo:new FormControl(data.id, Validators.required),
          htitulo: new FormControl(data.titulo, [Validators.required, Validators.maxLength(25)], [this.tituloRepetido.bind(this)]),
          hdescripcion:new FormControl(data.descripcion, Validators.required),
          hcurso: new FormControl(data.cur.id,[Validators.required])
        })
        this.cS.list().subscribe(data=>{
          this.listaCursos=data
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
    return this.sS.list().pipe(
        map(sesiones => {
            // Compara títulos y excluye el curso en edición usando this.id
            const existe = sesiones.some(sesion => sesion.titulo === control.value && sesion.id != this.id);
            return existe ? { tituloRepetido: true } : null;
        })
    );
}
}
