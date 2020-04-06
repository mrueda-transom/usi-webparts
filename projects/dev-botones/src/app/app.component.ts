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
  botones: any;

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadBotones();
  }


  private loadBotones() {
    const data = {
      select: ['Id', 'Title', 'Orden', 'Enlace', 'Color', 'Imagen'],
      orderBy: 'Orden',
      top: 20
    };

    this.sis.read('Botones', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              id: r.Id,
              image: r.Imagen,
              title: r.Title,
              enlace: r.Enlace,
              color: r.Color
            };
          })
        )
      )
      .subscribe(response => {
        this.botones = response;
      });
  }
}
