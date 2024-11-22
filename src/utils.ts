import { SVG } from 'leaflet';
import {
  defaultFeatureLayer,
  featureLayerBase,
} from 'leaflet-vector-tile-layer';

export function interactivePointsLayer(
  feature: any,
  layerName: any,
  pxPerExtent: any,
  options: any,
) {
  // Construct a base feature layer.
  const self = featureLayerBase(feature, layerName, pxPerExtent, options);

  // Compose this feature layer of two sub-layers, one for the visible
  // line controlled by `options` and a second controlled by the path
  // options contained in `options.interaction`. Both will share the same
  // path geometry.
  self.visiblePoint = defaultFeatureLayer(
    feature,
    layerName,
    pxPerExtent,
    options,
  );
  self.interactionPoint = defaultFeatureLayer(
    feature,
    layerName,
    pxPerExtent,
    options.interaction,
  );

  // Place the two layers in an SVG group.
  const group = SVG.create('g');
  group.appendChild(self.visiblePoint.graphics);
  group.appendChild(self.interactionPoint.graphics);
  self.graphics = group;

  // Setting of style is delegated to the sub layers.
  self.setStyle = function setStyle(style: any) {
    self.visiblePoint.setStyle(style);
    self.interactionPoint.setStyle(style.interaction);
  };

  // Initial setup of this feature layer.
  self.applyOptions(options);

  return self;
}
