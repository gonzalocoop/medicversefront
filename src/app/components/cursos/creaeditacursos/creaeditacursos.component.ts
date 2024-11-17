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

//Para rutear a otro componente
import { ActivatedRoute, Params, Router } from '@angular/router';
//para el if que se usa en errores en este caso
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule

//Para el model y el service
import { Cursos } from '../../../models/Cursos';
import { CursosService } from '../../../services/cursos.service';
import { map, Observable, of, startWith } from 'rxjs';




@Component({
  selector: 'app-creaeditacursos',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './creaeditacursos.component.html',
  styleUrl: './creaeditacursos.component.css'
})
export class CreaeditacursosComponent implements OnInit{
  form:FormGroup= new FormGroup({})
  curso:Cursos=new Cursos()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false

  

  constructor(private formBuilder:FormBuilder,private dS:CursosService, private router:Router, private route:ActivatedRoute){}
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
      htitulo: ['', [Validators.required, Validators.maxLength(35)],[this.tituloRepetido.bind(this)]],
      hdescripcion:['',Validators.required],
      hduracion: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}$')]
    ]
    })
    
  }
  aceptar(){
    if(this.form.valid){
      //Para el modificar
      this.curso.id=this.form.value.hcodigo;
      this.curso.titulo=this.form.value.htitulo;
      this.curso.descripcion=this.form.value.hdescripcion;
      this.curso.duracion=this.form.value.hduracion;
      if(this.edicion){
        this.dS.update(this.curso).subscribe((data)=>{
          this.dS.list().subscribe((data)=>{
            this.dS.setList(data)
          })
        })
      }
      else{
        this.dS.insert(this.curso).subscribe((data)=>{
          this.dS.list().subscribe(data=>{
            this.dS.setList(data)
          }) 
        }) 
      }
      this.router.navigate(['cursos'])
    } 
    else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
    } 
    
  }

  //para el modificar
  init(){
    if(this.edicion){
      this.dS.listId(this.id).subscribe((data)=>{
        // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
        this.form=new FormGroup({
          hcodigo:new FormControl(data.id, Validators.required),
          htitulo: new FormControl(data.titulo, [Validators.required, Validators.maxLength(35)], [this.tituloRepetido.bind(this)]),
          hdescripcion:new FormControl(data.descripcion, Validators.required),
          hduracion: new FormControl(data.duracion,[Validators.required, Validators.pattern('^[0-9]{1,2}$')]
        )
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
    return this.dS.list().pipe(
        map(cursos => {
            // Compara títulos y excluye el curso en edición usando this.id
            const existe = cursos.some(curso => curso.titulo === control.value && curso.id != this.id);
            return existe ? { tituloRepetido: true } : null;
        })
    );
}
}
