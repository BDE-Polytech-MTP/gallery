import './App.css';
import { useEffect, useState } from 'react';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';

const baseURL = 'http://localhost:5000';

function fetchAlbumsNames() {
  return fetch(`${baseURL}/albums`).then(res => res.json()).then(json => json.dirs)
}

function fetchAlbumImages(albumName) {
  return fetch(`${baseURL}/albums/${albumName}`).then(res => res.json()).then(json => json.files)
}

function AlbumDisplay(props) {
  const [urls, setUrls] = useState([])
  const [index, setIndex] = useState(null)

  useEffect(() => {
    fetchAlbumImages(props.name).then(urls => setUrls(urls.map(url => `${baseURL}/albums/${props.name}/${url}`)))
  }, [props.name])

  useEffect(() => {
    if (index === null && urls.length) {
      setIndex(0)
    }
  }, [urls, index])

  return urls.length ? <Lightbox
              mainSrc={urls[index]}
              nextSrc={urls[(index + 1) % urls.length]}
              prevSrc={urls[(index - 1 + urls.length) % urls.length]}
              onMoveNextRequest={() => setIndex((index + 1) % urls.length)}
              onMovePrevRequest={() => setIndex((index - 1 + urls.length) % urls.length)}
              onCloseRequest={() => props.onClose()}
      /> : null
}

function Album(props) {

  return <div class="Album">
    <h1>Album: {props.name}</h1>
    <button onClick={() => props.onSelect()}>Consulter les photos</button>
  </div>
}

function App() {

  const [albums, setAlbums] = useState([])
  const [shownAlbum, setShownAlbum] = useState(null)

  useEffect(() => {
    fetchAlbumsNames().then(albums => setAlbums(albums))
  }, [])

  return (
    <div class="App">
      {albums.map(album => <Album name={album} onSelect={() => setShownAlbum(album)} />)}
      {shownAlbum ? <AlbumDisplay name={shownAlbum} onClose={() => setShownAlbum(null)} /> : null}
    </div>
  );
}

export default App;
