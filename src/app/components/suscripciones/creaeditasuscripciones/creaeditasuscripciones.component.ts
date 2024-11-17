import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Suscripciones } from '../../../models/Suscripciones';
import { SuscripcionService } from '../../../services/suscripcion.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-creaeditasuscripciones',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './creaeditasuscripciones.component.html',
  styleUrl: './creaeditasuscripciones.component.css'
})
export class CreaeditasuscripcionesComponent implements OnInit{
  form:FormGroup= new FormGroup({})
  suscripciones:Suscripciones=new Suscripciones()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false


  constructor(private formBuilder:FormBuilder,private dS:SuscripcionService, private router:Router, private route:ActivatedRoute){}
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
      hnombre: ['', [Validators.required, Validators.maxLength(20)], [this.tituloRepetido.bind(this)]],
      hprecio: ['', [Validators.required, Validators.pattern('^[0-9]+\\.[0-9]{2}$'), Validators.maxLength(6)]]
    });
    
  
  }
  aceptar(){
    if(this.form.valid){
      //Para el modificar
      this.suscripciones.id=this.form.value.hcodigo;

      this.suscripciones.nombre=this.form.value.hnombre;
      this.suscripciones.precio=this.form.value.hprecio;
     
      if(this.edicion){
        this.dS.update(this.suscripciones).subscribe((data)=>{
          this.dS.list().subscribe((data)=>{
            this.dS.setList(data)
          })
        })
      }
      else{
        this.dS.insert(this.suscripciones).subscribe((data)=>{
          this.dS.list().subscribe(data=>{
            this.dS.setList(data)
          }) 
        }) 
      }
      this.router.navigate(['suscripciones'])
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
          hnombre: new FormControl(data.nombre, [Validators.required, Validators.maxLength(20)], [this.tituloRepetido.bind(this)]),
          hprecio: new FormControl(data.precio, [Validators.required, Validators.pattern('^[0-9]+\\.[0-9]{2}$'), Validators.maxLength(6)])
         
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
        map(suscripciones => {
            // Compara títulos y excluye el curso en edición usando this.id
            const existe = suscripciones.some(suscripcion => suscripcion.nombre === control.value && suscripcion.id != this.id);
            return existe ? { tituloRepetido: true } : null;
        })
    );
}
}
