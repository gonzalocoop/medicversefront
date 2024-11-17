import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Usuarios } from '../../models/Usuarios';
import { Roles } from '../../models/Roles';
import { UsuariosService } from '../../services/usuarios.service';
import { RolesService } from '../../services/roles.service';
import {  Router, RouterModule } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegistrarestudianteService } from '../../services/registrarestudiante.service';


@Component({
  selector: 'app-registrarestudiante',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    RouterModule
  ],
  templateUrl: './registrarestudiante.component.html',
  styleUrl: './registrarestudiante.component.css'
})
export class RegistrarestudianteComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuarios = new Usuarios();
  //variables para trabajar el editar
  id: number = 0;
  listaRoles: Roles[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private reS:RegistrarestudianteService
  ) {}

  
  ngOnInit(): void {
    //Para evitar errores
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      localStorage.clear();
    }

    this.form = this.formBuilder.group({
      hcodigo: [''], //para el modificar
      husername: ['',[Validators.required, Validators.maxLength(20)],[this.usernameRepetido.bind(this)],],
      hpassword: ['', Validators.required],
      hemail: ['', [Validators.required,Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)]],
      hrol: ['', [Validators.required]],
    });
    this.reS.listRoles().subscribe((data) => {
      // Filtrar los roles donde el nombre del rol sea "ESTUDIANTE"
      this.listaRoles = data.filter(role => role.nombre === 'ESTUDIANTE');
    });
  }

  aceptar() {
    if (this.form.valid) {
      //Para el modificar
      this.usuario.username = this.form.value.husername;
      this.usuario.password = this.form.value.hpassword;
      this.usuario.email = this.form.value.hemail;
      this.usuario.rol.id = this.form.value.hrol;
      this.reS.insert(this.usuario).subscribe((data) => {
        this.reS.listUsuarios()
      });
      alert("¡Cuenta creada exitosamente!, ahora inicie sesión");
      this.router.navigate(['iniciosesion']);
    } else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
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
    return this.reS.listUsuarios().pipe(
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


  
}
