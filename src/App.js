import './App.css';
import { useEffect, useState } from 'react';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';

const baseURL = 'http://localhost:5000';

function fetchAlbumImages(albumName) {
  return fetch(`${baseURL}/albums/${albumName}`).then(res => res.json()).then(json => json.files)
}

function fetchDirectoryContent(dir) {
  return fetch(`${baseURL}/albums${dir}`).then(res => res.json())
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

function Directory(props) {

  const [content, setContent] = useState(null)

  const clicked = () => {
    if (content) {
      if (content.files.length > 0) {
        props.display()
      } else if (content.dirs.length > 0) {
        props.open()
      }
    }
  }

  useEffect(() => {
    fetchDirectoryContent(props.path).then(content => setContent(content))
  }, [props.path])

  return <li className="directory" onClick={clicked}>
    <em>{props.dir}</em>
    {
      content ?
        <strong>
          {content.files.length > 0 ? `${content.files.length} photos` : content.dirs.length > 0 ? '>' : null}
        </strong> : null
    }
  </li>
}

function DirectoryList(props) {
  const [displayedDir, setDisplayedDir] = useState({
    parents: [],
    name: props.dir,
    children: null
  })

  const open = (newDirectory) => {
    const newParents = [...displayedDir.parents, displayedDir.name]
    setDisplayedDir({
      parents: newParents,
      name: newDirectory,
      children: null
    })
  }

  const back = () => {
    const newParents = [...displayedDir.parents]
    const newCurrentDirectory = newParents.pop()
    setDisplayedDir({
      parents: newParents,
      name: newCurrentDirectory,
      children: null
    })
  }

  const goTo = (targetDirectory) => {
    const newParents = [...displayedDir.parents]
    while (newParents[newParents.length - 1] !== targetDirectory) {
      newParents.pop()
    }
    const newCurrentDirectory = newParents.pop()
    setDisplayedDir({
      parents: newParents,
      name: newCurrentDirectory,
      children: null
    })
  }

  useEffect(() => {
    if (displayedDir.children === null) {
      const path = [...displayedDir.parents, displayedDir.name].join('/')
      fetchDirectoryContent(path).then(content => {
        setDisplayedDir({ ...displayedDir, children: content.dirs })
      })
    }
  }, [displayedDir])

  return (<>
      <ol className="breadcrumb">
        <li>Dossiers: </li>
      {
      [...displayedDir.parents, displayedDir.name]
        .flatMap((value, i) => i === 0 ? [value] : [' > ', value])
        .map((name, i, ar) => <li key={`${name}${i}`} onClick={i % 2 == 0 && i !== ar.length - 1 ? () => goTo(name) : undefined}>{name === null ? '/' : name}</li>)
      }
    </ol>
    <ul className="directories">
      {displayedDir.parents.length > 0 ? <li className="directory back" onClick={back}>&lt; Retour</li> : null}
      {displayedDir.children != null ? displayedDir.children.map(dirToShow => 
        <Directory 
          path={[ ...displayedDir.parents, displayedDir.name, dirToShow].join('/')} 
          dir={dirToShow} 
          open={() => open(dirToShow)}
          display={() => props.display([ ...displayedDir.parents, displayedDir.name, dirToShow].join('/'))}
          key={dirToShow}
        />
      ) : null}
    </ul>
  </>)
}

function App() {

  const [shownAlbum, setShownAlbum] = useState(null)

  return (
    <div className="App">
      <h1>Galerie Polytech Montpellier</h1>
      <DirectoryList dir={null} display={(path) => setShownAlbum(path)} />
      {shownAlbum ? <AlbumDisplay name={shownAlbum} onClose={() => setShownAlbum(null)} /> : null}
    </div>
  );
}

export default App;
