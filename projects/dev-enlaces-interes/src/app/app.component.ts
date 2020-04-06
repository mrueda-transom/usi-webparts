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
  enlaces: any;

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadEnlaces();
  }


  private loadEnlaces() {
    const data = {
      select: ['Id', 'Title', 'Orden', 'Descripcion', 'Enlace', 'Imagen', 'PalabrasClave'],
      // orderBy: 'Orden',
      // top: 20
    };

    this.sis.read('Enlaces', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              id: r.Id,
              image: null,
              title: r.Title,
              description: r.Descripcion,
              enlace: r.Enlace
            };
          })
        )
      )
      .subscribe(response => {
        this.enlaces = response;

        this.loadImages();
      });
  }

  private loadImages() {
    const data = {
      select: ['Imagen']
    };
    const requests = [];

    this.enlaces.forEach(n => {
      requests.push(
        this.sis.read('Enlaces', data, n.id)
      );
    });

    forkJoin(requests)
      .pipe(
        first()
      )
      .subscribe((response: any) => {
        response.forEach((r, index) => {
          this.enlaces[index].image = r.Imagen;
        });
      });
  }
}
