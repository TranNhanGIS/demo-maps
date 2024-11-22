import './VectorTileLayer.css';
import { useEffect, Fragment, FC, useRef, useState } from 'react';
import { icon, popup, Popup, point, LeafletMouseEvent } from 'leaflet';
import { useMap } from 'react-leaflet';
import vectorTileLayer from 'leaflet-vector-tile-layer';
import { interactivePointsLayer } from './utils';

type LocationData = {
  address: string;
  dist_code: number;
  dist_name: string;
  id: number;
  lat: string;
  lng: string;
  name: string;
  prov_code: number;
  prov_name: string;
  type: string;
  ward_code: number;
  ward_name: string;
};

type VectorTileLayerProps = {
  layerUrl: string;
  layerName: string;
};

const iconURL =
  'https://raw.githubusercontent.com/ttungbmt/fontawesome-pro/refs/heads/main/svgs/solid/user-police.svg';

const interactivePointStyles = {
  icon: icon({
    iconUrl: iconURL,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }),
  interaction: {
    fill: true,
    color: '#0077b6',
    fillColor: '#00adef',
    opacity: 0.6,
    fillOpacity: 0.6,
    weight: 1,
    radius: 15,
  },
};

function generatePopupContent(data: LocationData) {
  return `
      <b>Thông tin:</b><br>
      Tên: ${data.name || 'Không có tên'}<br>
      Loại: ${data.type || 'Không có loại'}
  `;
}

const VectorTileLayer: FC<VectorTileLayerProps> = ({ layerUrl, layerName }) => {
  const map = useMap();
  const tileLayerRef = useRef<any>();
  const popupRef = useRef<Popup | undefined>();
  const [isInsidePopup, setInsidePopup] = useState<boolean>(false);

  useEffect(() => {
    const options = {
      maxDetailZoom: 7,
      style: interactivePointStyles,
      featureToLayer: interactivePointsLayer,
    };
    const tileLayer = vectorTileLayer(layerUrl, options);
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer
  }, [map, layerUrl]);

  useEffect(() => {
    const tileLayer = tileLayerRef.current

    function handleClosePopup() {
      const popupEle: HTMLElement | undefined = popupRef.current?.getElement();

      function handleMouseEnter() {
        setInsidePopup(true)
        // tileLayer?.off('mouseout', handleClosePopup)
      }

      function handleMouseLeave() {
        setInsidePopup(false)
        // tileLayer?.on('mouseout', handleClosePopup)
      }
      
      if (!isInsidePopup) {
        popupRef.current?.removeFrom(map);
      }

      if (popupEle) {
        popupEle?.removeEventListener('mouseenter', handleMouseEnter);
        popupEle?.removeEventListener('mouseleave', handleMouseLeave);
        
        popupEle?.addEventListener('mouseenter', handleMouseEnter);
        popupEle?.addEventListener('mouseleave', handleMouseLeave);
      }
    }

    function handleOpenPopup(e: LeafletMouseEvent) {
      const properties = e.layer.properties;
      const popupContent = generatePopupContent(properties);
      
      const popupOptions = {
        closeButton: false,
        closeOnEscapeKey: true,
        autoClose: true,
        autoPan: true,
        offset: point(0,20)
      };

      popupRef.current = popup(popupOptions)
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);
    }

    tileLayer?.on('mouseover', handleOpenPopup);
    tileLayer?.on('mouseout', handleClosePopup);

    return () => {
      tileLayer?.off('mouseover', handleOpenPopup);
      tileLayer?.off('mouseout', handleClosePopup);
    };
  }, [tileLayerRef, map, isInsidePopup])
  
  useEffect(() => {
    if (!isInsidePopup) {
      popupRef.current?.removeFrom(map);
    }
  }, [popupRef, map, isInsidePopup])

  return <Fragment />;
};

export default VectorTileLayer;
