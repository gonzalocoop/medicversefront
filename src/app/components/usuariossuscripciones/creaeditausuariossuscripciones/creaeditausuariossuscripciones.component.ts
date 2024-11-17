import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioSuscripciones } from '../../../models/UsuarioSuscripciones';
import { Suscripciones } from '../../../models/Suscripciones';
import { Usuarios } from '../../../models/Usuarios';
import { UsuarioSuscripcionesService } from '../../../services/usuario-suscripciones.service';
import { SuscripcionService } from '../../../services/suscripcion.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-creaeditausuariossuscripciones',
  standalone: true,
  providers:[provideNativeDateAdapter(),{provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  imports: [MatFormFieldModule,MatInputModule, MatSelectModule,MatDatepickerModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './creaeditausuariossuscripciones.component.html',
  styleUrl: './creaeditausuariossuscripciones.component.css'
})
export class CreaeditausuariossuscripcionesComponent implements OnInit{
  role: string = '';
  selectedUser: string = localStorage.getItem("username") ?? "";

  form:FormGroup= new FormGroup({})
  usuarioSuscripciones:UsuarioSuscripciones=new UsuarioSuscripciones()
  //variables para trabajar el editar
  id:number=0
  edicion:boolean=false
  //Para traer los elementos de sesiones
  listaSuscripciones: Suscripciones[] = [];
  listaUsuarios: Usuarios[] = [];
  
  


  constructor(private lS: LoginService,private formBuilder:FormBuilder,private usS:UsuarioSuscripcionesService, private sS:SuscripcionService,private uS:UsuariosService,private router:Router, private route:ActivatedRoute){}
  ngOnInit(): void {
    this.role = this.lS.showRole();  // Aquí te aseguras de que el rol esté actualizado
    //Para trabajar el editar
    this.route.params.subscribe((data:Params)=>{ //el  data['id'] es del id del parametro
      this.id=data['id'];
      this.edicion=data['id']!=null //Si el id es diferente de null, osea que se esta ingresando con un id, entonces el edicion se vuelve true
      
      //data de la tabla para mostrarla
      this.init();
    })

    if (!this.isAdmin()) {
      const today = new Date();
      const fechaInicio = today; // Fecha de inicio es hoy
      const fechaFin = new Date(fechaInicio); // Copiar fecha de inicio para fecha final
      fechaFin.setMonth(fechaFin.getMonth() + 1); // Sumar 1 mes a la fecha de inicio
  
      this.form = this.formBuilder.group({
        hcodigo: [''], // para el modificar
        hfechaInicio: [fechaInicio, [Validators.required]],
        hfechaFin: [fechaFin, [Validators.required, this.fechaFinPosteriorAFechaInicioValidator.bind(this)]],
        hsuscripciones: ['', Validators.required],
        husuario: ['', [Validators.required], [this.usuarioUnico.bind(this)]],
      });
    } else {
      this.form = this.formBuilder.group({
        hcodigo: [''], // para el modificar
        hfechaInicio: ['', [Validators.required]],
        hfechaFin: ['', [Validators.required, this.fechaFinPosteriorAFechaInicioValidator.bind(this)]],
        hsuscripciones: ['', Validators.required],
        husuario: ['', [Validators.required], [this.usuarioUnico.bind(this)]],
      });
    }
    this.sS.list().subscribe(data=>{
      this.listaSuscripciones=data
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
    
      this.usuarioSuscripciones.id=this.form.value.hcodigo;

   
      this.usuarioSuscripciones.fechaInicio=this.form.value.hfechaInicio;
      this.usuarioSuscripciones.fechaFin=this.form.value.hfechaFin;
      this.usuarioSuscripciones.sus.id=this.form.value.hsuscripciones;
      this.usuarioSuscripciones.usu.id=this.form.value.husuario;

     
      if(this.edicion){
        this.usS.update(this.usuarioSuscripciones).subscribe((data)=>{
          this.usS.list().subscribe((data)=>{
            this.usS.setList(data)
          })
        })
      }
      else{
        this.usS.insert(this.usuarioSuscripciones).subscribe((data)=>{
          this.usS.list().subscribe(data=>{
            this.usS.setList(data)
          }) 
        }) 
      }
      this.router.navigate(['usuariossuscripciones'])
    } 
    else {
      console.log('Formulario no válido');
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
    } 
    
  }

  //para el modificar
  init() {
    if (this.edicion) {
      this.usS.listId(this.id).subscribe((data) => {
        // Marca todos los campos como tocados para mostrar errores
        this.form.markAllAsTouched();
  
        // Si no es admin, establecer fechas predeterminadas
        if (!this.isAdmin()) {
          const today = new Date();
          const fechaInicio = today; // Fecha de inicio es hoy
          const fechaFin = new Date(fechaInicio); // Copiar fecha de inicio para fecha final
          fechaFin.setMonth(fechaFin.getMonth() + 1); // Sumar 1 mes a la fecha de inicio
  
          // Establecer las fechas en el formulario
          this.form = new FormGroup({
            hcodigo: new FormControl(data.id, Validators.required),
            hfechaInicio: new FormControl(fechaInicio, Validators.required),
            hfechaFin: new FormControl(fechaFin, [Validators.required, this.fechaFinPosteriorAFechaInicioValidator.bind(this)]),
            hsuscripciones: new FormControl(data.sus.id, Validators.required),
            husuario: new FormControl(data.usu.id, [Validators.required], [this.usuarioUnico.bind(this)]),
          });
        } else {
          // Si es admin, asignar las fechas originales del `data`
          this.form = new FormGroup({
            hcodigo: new FormControl(data.id, Validators.required),
            hfechaInicio: new FormControl(data.fechaInicio, Validators.required),
            hfechaFin: new FormControl(data.fechaFin, [Validators.required, this.fechaFinPosteriorAFechaInicioValidator.bind(this)]),
            hsuscripciones: new FormControl(data.sus.id, Validators.required),
            husuario: new FormControl(data.usu.id, [Validators.required], [this.usuarioUnico.bind(this)]),
          });
        }
  
        this.sS.list().subscribe(data => {
          this.listaSuscripciones = data;
        });
  
        if (this.isAdmin()) {
          this.uS.list().subscribe(data => {
            this.listaUsuarios = data;
          });
        } else {
          this.uS.usuarioPorUsername(this.selectedUser).subscribe(data => {
            this.listaUsuarios = [data];
          });
        }
      });
    }
  }



  // Función de validación personalizada para la fecha final
fechaFinPosteriorAFechaInicioValidator(control: AbstractControl): ValidationErrors | null {
  const fechaInicio = this.form.get('hfechaInicio')?.value;
  const fechaFin = control.value;

  if (fechaInicio && fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Si la fecha final es menor o igual a la fecha de inicio
    if (fin <= inicio) {
      return { fechaFinPosteriorAFechaInicioValidator: true };  // Retorna error
    }
  }
  return null;  // Retorna null si la fecha final es válida
}



usuarioUnico(control: AbstractControl): Observable<ValidationErrors | null> {
  // Si el campo está vacío, se considera válido
  if (!control.value) {
    return of(null);
  }

  // Llamamos al servicio para obtener la lista de suscripciones
  return this.usS.list().pipe(  // 'usS.list()' es el método para obtener todas las suscripciones
    map(suscripciones => {
      // Verificamos si el usuario ya tiene una suscripción
      const usuarioId = control.value; // El valor del control es el ID del usuario
      const existeSuscripcion = suscripciones.some(suscripcion => suscripcion.usu.id === usuarioId && suscripcion.id != this.id);

      return existeSuscripcion ? { usuarioYaTieneSuscripcion: true } : null;  // Retorna el error si el usuario ya tiene una suscripción
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
