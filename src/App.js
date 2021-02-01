import './App.css'
import { useState } from 'react'
import DirectoryList from './DirectoryList'
import AlbumLightBox from './AlbumLightbox'
import Password from './Password'

function App() {

  const [password, setPassword] = useState('')
  const [shownAlbum, setShownAlbum] = useState(null)

  return (
    <div className="App">
      <h1>Galerie Polytech Montpellier</h1>
      { 
        password ? 
        <DirectoryList password={password} dir={null} display={(path) => setShownAlbum(path)} /> : 
        <Password onCorrectPassword={(pass) => setPassword(pass)} />
      }
      { password && shownAlbum ? <AlbumLightBox password={password} name={shownAlbum} onClose={() => setShownAlbum(null)} /> : null}
    </div>
  );
}

export default App;
