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
  sectores: any;

  constructor(
    private sis: SharepointIntegrationService,
  ) { }

  ngOnInit() {
     this.loadSectores();
  }


  private loadSectores() {
    const data = {
      select: ['Id', 'Title', 'Imagen',  'Color', 'Enlace', 'TituloContenido', 'Contenido', 'Orden', 'Accion', 'Forma'],
      orderBy: 'Orden'
    };

    this.sis.read('Sectores', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              id: r.Id,
              image: r.Imagen,
              title: r.Title,
              enlace: r.Enlace,
              color: r.Color,
              titleContent: r.TituloContenido,
              content: r.Contenido,
              action: r.Accion,
              shape: r.Forma,
              order: r.Orden,
            };
          })
        )
      )
      .subscribe(response => {
        this.sectores = response;
      });
  }

  sectorFilter(items) {
    return items.filter(i => i.order >= 1 && i.order <= 5);
  }
}
