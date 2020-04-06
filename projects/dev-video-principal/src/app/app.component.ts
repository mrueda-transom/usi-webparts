import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { map, first, tap } from 'rxjs/operators';
import { SharepointIntegrationService } from 'shared-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  video: any;

  url = 'https://www.youtube.com/embed';
  urlFb = 'https://www.facebook.com/plugins/video.php?href';
  // urlSafe: SafeResourceUrl;

  constructor(
    private sis: SharepointIntegrationService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const data = {
      select: ['Id', 'Title', 'Orden', 'Idvideo', 'Imagen', 'Fuente', 'EnlaceVideo', 'MostrarF'],
      filter: ['Orden eq 1']
    };

    this.sis.read('Videoprincipal', data)
      .pipe(
        map((videos: any) => ({
          id: videos.value[0].Id,
          image: videos.value[0].Imagen,
          title: videos.value[0].Title,
          fuente: videos.value[0].Fuente,
          mostrar: videos.value[0].MostrarF,
          urlSafe: this.sanitizer.bypassSecurityTrustResourceUrl(`${this.url}/${videos.value[0].Idvideo}`),
          fbUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`${this.urlFb}=${videos.value[0].EnlaceVideo}`),
        }))
      )
      .subscribe(
        videos => {
          this.video = videos;
        },
        err => console.log(err),
        () => {}
      );
  }

  cambiar(item) {
    return this.video = {
      id: item.id,
      title: item.title,
      fuente: item.fuente,
      urlSafe: item.urlSafe,
      fbUrl: item.fbUrl
    };
  }
}
