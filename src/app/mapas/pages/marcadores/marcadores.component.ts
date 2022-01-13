import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor{
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
    .map-container {
      height: 100%;
      width: 100%;
    }

    .list-group {
      position: fixed;
      right: 20px;
      top: 20px;
      z-index: 99999;
    }

    li {
      cursor: pointer;
    }
  `]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [ -116.87802488693157, 32.08928700161597 ];
  //Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo'

    // //const marker = 
    // new mapboxgl.Marker( {
    //   element: markerHtml,
    // })
    //   .setLngLat( this.center )
    //   .addTo( this.mapa );

    this.leerMarcadorLocalStorage();

  }

  agregarMarcador() {

    const color = `#${crypto.getRandomValues(new Uint32Array(1))[0].toString(16).padStart(8, '0').slice(-6)}`

    //const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));


    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color
    })
      .setLngLat( this.center )
      .addTo( this.mapa );

    this.marcadores.push( {
      color, 
      marker: nuevoMarcador 
    } );

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on( 'dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  irAMarcador(marcador: mapboxgl.Marker) {
   
    this.mapa.flyTo({
      center: marcador.getLngLat()
    })
  }

  guardarMarcadoresLocalStorage() {

    const marcadoresArr: MarcadorColor[] = [];

    this.marcadores.forEach( m=> {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      marcadoresArr.push({ 
        color: color,
        center: [ lng, lat ]
      });

      localStorage.setItem('marcadores', JSON.stringify(marcadoresArr));
    })



  }

  leerMarcadorLocalStorage() {

    if(!localStorage.getItem('marcadores') ) {
      return;
    }

    const marcadoresArr: MarcadorColor[] = 
      JSON.parse(localStorage.getItem('marcadores')!);

    console.log(marcadoresArr);

    marcadoresArr.forEach( m => {

      const nuevoMarcador  = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat( m.center! )
        .addTo( this.mapa );

      this.marcadores.push( {
        color: m.color, 
        marker: nuevoMarcador 
      } );

      nuevoMarcador.on( 'dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });
      
    });


  }

  borrarMarcador( indice: number ) {

    this.marcadores[indice].marker?.remove();
    this.marcadores.splice(indice, 1 );
    this.guardarMarcadoresLocalStorage();
  }

}
