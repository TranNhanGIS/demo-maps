import "leaflet/dist/leaflet.css";
import { LatLngExpression } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import VectorTileLayer from './VectorTileLayer'

const baseMapURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
// const baseMapURL = "http://localhost:8081/styles/basic-preview/512/{z}/{x}/{y}.png"
const layerURL = "https://maps.gtelict.vn/geoserver/gwc/service/tms/1.0.0/osm:v_congan_pt@EPSG:900913@pbf/{z}/{x}/{-y}.pbf"
const position: LatLngExpression = [21.03865090035212, 105.82868506411747]
const styles = { width: '100%', height: '95vh' }

const App = () => (
  <MapContainer center={position} zoom={13} style={styles}>
    <TileLayer url={baseMapURL} />
    <VectorTileLayer layerUrl={layerURL} layerName="v_congan_pt" />
  </MapContainer>
)

export default App;
