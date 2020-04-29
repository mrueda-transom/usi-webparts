import { Component,  OnInit } from '@angular/core';
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
  banner: any = [];
  top: any;

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadBannerMaster();
  }


  private loadBannerMaster() {
    const data = {
      select: ['Id', 'Title', 'Orden', 'Descripcion', 'Enlace', 'Imagen', 'Subtitulo', 'Activarboton', 'Palabrasclave', 'Dependencia',
              'Textodelboton', 'Posiciontexto', 'Enlaceboton', 'Activartitulo', 'subSitios', 'BannerPrincipal', 'Created'],
      orderBy: 'Created',
      reverse: true,
      top: 20
    };

    this.sis.read('Banner', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              created: new Date(r.Created),
              id: r.Id,
              image: r.Imagen,
              title: r.Title,
              description: r.Descripcion,
              enlace: r.Enlace,
              subtitulo: r.Subtitulo,
              activarBoton: r.Activarboton,
              dependencia: r.Dependencia,
              textoBoton: r.Textodelboton,
              posicionTexto: r.Posiciontexto,
              enlaceBoton: r.Enlaceboton,
              activarTitulo: r.Activartitulo,
              subSitios: r.subSitios,
              principal: r.BannerPrincipal,
            };
          })
        )
      )
      .subscribe(response => {
        if (response) {
          response.forEach(element => {
            if (element.principal) {
              this.banner.push(element);
            }
          });
          this.top = 20 - this.banner.length;
          console.log('Master');
          console.log(this.banner.length);
          console.log(this.top);
          this.loadBannerLocal();
        } else {
            this.top = 20;
            this.loadBannerLocal();
        }
      });
  }

  private loadImagesMaster() {
    const data = {
      select: ['Imagen']
    };
    const requests = [];

    this.banner.forEach(n => {
      requests.push(
        this.sis.read('Banner', data, n.id)
      );
    });

    forkJoin(requests)
      .pipe(
        first()
      )
      .subscribe((response: any) => {
        response.forEach((r, index) => {
          this.banner[index].image = r.Imagen;
        });
      });
  }

  private loadBannerLocal() {
    const data2 = {
      select: ['Id', 'Title', 'Orden', 'Descripcion', 'Enlace', 'Imagen', 'Subtitulo', 'Activarboton', 'Palabrasclave', 'Dependencia',
              'Textodelboton', 'Posiciontexto', 'Enlaceboton', 'Activartitulo', 'subSitios', 'BannerPrincipal', 'Created'],
      filter: ['BannerPrincipal eq false'],
      orderBy: 'Orden',
      top: this.top,
    };

    this.sis.read('Banner', data2)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              created: new Date(r.Created),
              id: r.Id,
              order: r.Orden,
              image: r.Imagen,
              title: r.Title,
              description: r.Descripcion,
              enlace: r.Enlace,
              subtitulo: r.Subtitulo,
              activarBoton: r.Activarboton,
              dependencia: r.Dependencia,
              textoBoton: r.Textodelboton,
              posicionTexto: r.Posiciontexto,
              enlaceBoton: r.Enlaceboton,
              activarTitulo: r.Activartitulo,
              subSitios: r.subSitios,
              principal: r.BannerPrincipal,
            };
          })
        )
      )
      .subscribe(response => {
        response.forEach(element => {
          this.banner.push(element);
        });
      });
  }
}
