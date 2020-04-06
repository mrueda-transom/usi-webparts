import { Component, OnInit, Input } from '@angular/core';
import { SharepointIntegrationService } from 'shared-lib';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'dc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  news: any;
  global: any;

  slideConfig = { autoplay: false, slidesToShow: 2, slidesToScroll: 1, infinite: false, responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ], };

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadNews();
    this.loadGlobal();
  }

  private loadNews() {
    const data = {
      select: ['Id', 'Title', 'Created', 'Descripcion'],
      orderBy: 'Created',
      reverse: true,
      top: 20
    };

    this.sis.read('Noticias', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              created: new Date(r.Created),
              id: r.Id,
              image: null,
              title: r.Title,
              description: r.Descripcion,
            };
          })
        )
      )
      .subscribe(response => {
        this.news = response;

        this.loadImages();
      });
  }

  private loadImages() {
    const data = {
      select: ['Imagen']
    };
    const requests = [];

    this.news.forEach(n => {
      requests.push(
        this.sis.read('Noticias', data, n.id)
      );
    });

    forkJoin(requests)
      .pipe(
        first()
      )
      .subscribe((response: any) => {
        response.forEach((r, index) => {
          this.news[index].image = r.Imagen;
        });
      });
  }

  private loadGlobal() {
    const data = {
      select: ['Id', 'Lista', 'MostrarTodos'],
      filter: ['Lista eq \'Noticias\'']
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
