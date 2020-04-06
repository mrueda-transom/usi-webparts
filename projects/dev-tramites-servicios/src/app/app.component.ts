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
  tramites: any;
  global: any;

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadTramites();
    this.loadGlobal();
  }


  private loadTramites() {
    const data = {
      select: ['Id', 'Title', 'Imagen', 'Orden', 'Descripcion', 'Enlace', 'Vertodos'],
      orderBy: 'Orden'
    };

    this.sis.read('Tramites', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              id: r.Id,
              image: null,
              title: r.Title,
              description: r.Descripcion,
              enlace: r.Enlace,
              orden: r.Orden
            };
          })
        )
      )
      .subscribe(response => {
        this.tramites = response;

        this.loadImages();
      });
  }

  private loadImages() {
    const data = {
      select: ['Imagen']
    };
    const requests = [];

    this.tramites.forEach(n => {
      requests.push(
        this.sis.read('Tramites', data, n.id)
      );
    });

    forkJoin(requests)
      .pipe(
        first()
      )
      .subscribe((response: any) => {
        response.forEach((r, index) => {
          this.tramites[index].image = r.Imagen;
        });
      });
  }

  private loadGlobal() {
    const data = {
      select: ['Id', 'Lista', 'MostrarTodos'],
      filter: ['Lista eq \'Tramites\'']
    };

    this.sis.read('Global', data)
    .pipe(
      map((response: any) =>
        ({
          id: response.value[0].Id,
          mostrarTodos: response.value[0].MostrarTodos,
        })
      )
    )
    .subscribe(response => {
      this.global = response;
    });
  }
}
