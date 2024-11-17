import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Usuarios } from '../../../models/Usuarios';
import { Roles } from '../../../models/Roles';
import { UsuariosService } from '../../../services/usuarios.service';
import { RolesService } from '../../../services/roles.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { LoginService } from '../../../services/login.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-creaeditausuarios',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule
  ],
  templateUrl: './creaeditausuarios.component.html',
  styleUrl: './creaeditausuarios.component.css',
})
export class CreaeditausuariosComponent implements OnInit {
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';
  form: FormGroup = new FormGroup({});
  usuario: Usuarios = new Usuarios();
  //variables para trabajar el editar
  id: number = 0;
  edicion: boolean = false;
  //Para traer los elementos de dispositivos
  listaRoles: Roles[] = [];
  //Usuario previo
  usuarioPrevioCambio:string=''
  constructor(
    private formBuilder: FormBuilder,
    private uS: UsuariosService,
    private rS: RolesService,
    private router: Router,
    private route: ActivatedRoute,
    private lS: LoginService,
  ) {}

  ngOnInit(): void {
    this.role = this.lS.showRole();  
    //Para trabajar el editar
    this.route.params.subscribe((data: Params) => {
      //el  data['id'] es del id del parametro
      this.id = data['id'];
      this.edicion = data['id'] != null; //Si el id es diferente de null, osea que se esta ingresando con un id, entonces el edicion se vuelve true
      //data de la tabla para mostrarla
      this.init();
    });

    this.form = this.formBuilder.group({
      hcodigo: [''], //para el modificar
      husername: [
        '',
        [Validators.required, Validators.maxLength(20)],
        [this.usernameRepetido.bind(this)],
      ],
      hpassword: ['',[Validators.required]], // Si es edición, no se hace obligatorio
      hemail: ['', [Validators.required,Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)]],
      hactivo:[true, Validators.required],
      hrol: ['', [Validators.required]],
    });
    this.rS.list().subscribe((data) => {
      this.listaRoles = data;
    });
  }

  aceptar() {
    if (this.form.valid) {
      // Para el modificar
      this.usuario.id = this.form.value.hcodigo;
      this.usuario.username = this.form.value.husername;
      this.usuario.email = this.form.value.hemail;
  
      // Solo actualiza la contraseña si el campo no está vacío
      if (this.edicion) {
        if (this.form.controls['hpassword'].value.trim() !== '') {
          // Si el campo de la contraseña no está vacío, actualiza la contraseña
          this.usuario.password = this.form.value.hpassword;
        } else {
          // Si el campo está vacío, mantén la contraseña actual sin cambios
          // Esto se hace para que no sobrescriba la contraseña con un valor vacío
          this.usuario.password = this.usuario.password; 
        }
      } else {
        // Si es nuevo usuario (no edición), asigna la contraseña normalmente
        this.usuario.password = this.form.value.hpassword;
      }
  
      this.usuario.rol.id = this.form.value.hrol;
  
      // Si estás editando y eres administrador, asigna el valor de `hactivo`
      this.usuario.activo = this.isAdmin() ? this.form.value.hactivo : true;
  
      if (this.edicion) {
        // Si la contraseña se ha modificado (es decir, el campo está "dirty"), actualiza con la nueva contraseña
      
        if (this.form.controls['hpassword'].dirty) {
          this.uS.updateEncript(this.usuario).subscribe((data) => {
            this.uS.list().subscribe((data) => {
              this.uS.setList(data);
            });
          });
        } else {
          this.uS.update(this.usuario).subscribe((data) => {
            this.uS.list().subscribe((data) => {
              this.uS.setList(data);
            });
          });
        }
      } else {
        this.uS.insert(this.usuario).subscribe((data) => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
          });
        });
      }
      if (this.form.controls['husername'].dirty && this.usuarioPrevioCambio === this.selectedUser) {
       alert("Cambio en el nombre de usuario detectado, reidirigiendo a Login, actualice la pagina al llegar y vuelva a iniciar sesión")
      
        // 1. Limpiar la sesión solo después de verificar que el cambio es real.
        sessionStorage.clear();
        localStorage.clear();
      
        // 2. Redirigir al login (asegúrate de que la ruta está correctamente configurada en las rutas de la aplicación)
        this.router.navigate(['iniciosesion']).then(() => {
        });
      }
      this.router.navigate(['usuarios']);
    } else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
    }
  }

  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data) => {
        this.usuarioPrevioCambio = data.username;
        // Inicializamos el formulario primero
        this.form = new FormGroup({
          hcodigo: new FormControl(data.id, Validators.required),
          husername: new FormControl(
            data.username,
            [Validators.required, Validators.maxLength(20)],
            [this.usernameRepetido.bind(this)] // Validación asíncrona
          ),
          hpassword: new FormControl(''),  // En edición, dejamos la contraseña vacía, no obligatorio
          hemail: new FormControl(data.email, [
            Validators.required,
            Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/),
          ]),
          hrol: new FormControl(data.rol.id, Validators.required),
          hactivo: new FormControl(
            this.isAdmin() ? data.activo : true,
            Validators.required
          ),
        });
        // Mantén la contraseña original en el usuario
        this.usuario.password = data.password; // No sobrescribir la contraseña
        this.rS.list().subscribe((data) => {
          this.listaRoles = data;
        });
      });
    }
  }

  usernameRepetido(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    // Si el campo está vacío, se considera válido
    if (!control.value) {
      return of(null); // Retorna válido si el campo está vacío
    }

    // Llama a la lista de cursos y verifica si hay títulos repetidos
    return this.uS.list().pipe(
      map((usuarios) => {
        // Compara títulos y excluye el curso en edición usando this.id
        const existe = usuarios.some(
          (usuario) =>
            usuario.username === control.value && usuario.id != this.id
        );
        return existe ? { usernameRepetido: true } : null;
      })
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
