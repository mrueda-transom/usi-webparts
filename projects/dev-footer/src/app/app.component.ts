import { Component, OnInit } from '@angular/core';
import { SharepointIntegrationService } from 'shared-lib';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  footer: any;
  global: any;
  opcion = null;

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadFooter();
    this.loadGlobal();
  }


  private loadFooter() {
    const data = {
      select: ['Id', 'Title', 'texto1', 'Enlace1', 'check1', 'texto2', 'Enlace2', 'check2', 'texto3', 'Enlace3', 'check3',
      'texto4', 'Enlace4', 'check4', 'texto5', 'Enlace5', 'check5', 'texto6', 'Enlace6', 'check6', 'texto7', 'Enlace7', 'check7'],
      top: 4,
    };

    this.sis.read('Piedepagina', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              id: r.Id,
              title: r.Title,
              texto1: r.texto1,
              Enlace1: r.Enlace1,
              check1: r.check1,
              texto2: r.texto2,
              Enlace2: r.Enlace2,
              check2: r.check2,
              texto3: r.texto3,
              Enlace3: r.Enlace3,
              check3: r.check3,
              texto4: r.texto4,
              Enlace4: r.Enlace4,
              check4: r.check4,
              texto5: r.texto5,
              Enlace5: r.Enlace5,
              check5: r.check5,
              texto6: r.texto6,
              Enlace6: r.Enlace6,
              check6: r.check6,
              texto7: r.texto7,
              Enlace7: r.Enlace7,
              check7: r.check7,
            };
          })
        )
      )
      .subscribe(response => {
        console.log(response);
        this.footer = response;
      });
    }

    private loadGlobal() {
      const data = {
        select: ['Id', 'Lista', 'rutaPoliticas', 'Derechos', 'opcionPoliticas'],
        filter: ['Lista eq \'Piedepagina\'']
      };

      this.sis.read('Global', data)
        .pipe(
          map((response: any) =>
            ({
              id: response.value[0].Id,
              opcionPoliticas: response.value[0].opcionPoliticas,
              rutaPoliticas: response.value[0].rutaPoliticas,
              Derechos: response.value[0].Derechos
            })
          )
        )
        .subscribe(response => {
          this.global = response;
        });
      }
}
