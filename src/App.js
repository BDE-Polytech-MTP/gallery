import './App.css'
import { useState } from 'react'
import DirectoryList from './DirectoryList'
import AlbumLightBox from './AlbumLightbox'

function App() {

  const [shownAlbum, setShownAlbum] = useState(null)

  return (
    <div className="App">
      <h1>Galerie Polytech Montpellier</h1>
      <DirectoryList dir={null} display={(path) => setShownAlbum(path)} />
      {shownAlbum ? <AlbumLightBox name={shownAlbum} onClose={() => setShownAlbum(null)} /> : null}
    </div>
  );
}

export default App;
