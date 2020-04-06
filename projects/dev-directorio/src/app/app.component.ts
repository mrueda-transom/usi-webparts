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
  directorio: any;

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadDirectorio();
  }

  private loadDirectorio() {
    const data = {
      select: ['Id', 'Title', 'Imagen', 'Orden', 'Descripcion', 'Color', 'Enlace'],
      orderBy: 'Orden'
    };

    this.sis.read('Directorio', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              id: r.Id,
              image: null,
              title: r.Title,
              description: r.Descripcion,
              orden: r.Orden,
              color: r.Color,
              enlace: r.Enlace
            };
          })
        )
      )
      .subscribe(response => {
        this.directorio = response;

        this.loadImages();
      });
  }

  private loadImages() {
    const data = {
      select: ['Imagen']
    };
    const requests = [];

    this.directorio.forEach(n => {
      requests.push(
        this.sis.read('Directorio', data, n.id)
      );
    });

    forkJoin(requests)
      .pipe(
        first()
      )
      .subscribe((response: any) => {
        response.forEach((r, index) => {
          this.directorio[index].image = r.Imagen;
        });
      });
  }
}
