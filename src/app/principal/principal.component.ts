import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  
  constructor(private router: Router) { }

  navegar(pagina:string){
    this.router.navigateByUrl(pagina);
  }
}
