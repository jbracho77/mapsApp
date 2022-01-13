import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

const MAX_ZOOM_LEVEL: number = 18;

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
  .map-container {
    height: 100%;
    width: 100%;
  }

  .row {
    background-color: white;
    border-radius: 5px;
    bottom: 50px;
    left: 50px;
    padding: 10px;
    position: fixed;
    z-index: 99999;
    width: 400px;
  }
`]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 8;
  center: [number, number] = [ -116.87802488693157, 32.08928700161597 ]
  
  

  constructor() { }

  
  ngAfterViewInit(): void {
    
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    
    this.mapa.on('zoom', (ev) => {
      this.zoomLevel = this.mapa.getZoom();
    })
    
    this.mapa.on('zoomend', (ev) => {
      if ( this.mapa.getZoom() > MAX_ZOOM_LEVEL ) {
        this.mapa.zoomTo ( MAX_ZOOM_LEVEL );
      };
    })
    
    this.mapa.on('move', (evento) => {
      const target = evento.target;
      const { lng, lat } = target.getCenter();
      this.center = [ lng, lat ];
      
      //this.center = [ this.mapa.getCenter().lng, this.mapa.getCenter().lat ] ;
    })
    
  }

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {} );
    this.mapa.off('zoomend', () => {} );
    this.mapa.off('move', () => {} );

  }
  
  zoomIn() {
    this.mapa.zoomIn();

    //this.zoomLevel = this.mapa.getZoom();
  }
  
  zoomOut() {
    this.mapa.zoomOut();

    //this.zoomLevel = this.mapa.getZoom();
  }

  zoomChange( valor: string ) {
    this.mapa.zoomTo ( Number( valor ) );
  }

}
