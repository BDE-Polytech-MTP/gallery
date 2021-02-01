import { useState, useEffect } from 'react'
import { fetchDirectoryContent } from './data'
import './DirectoryList.css'

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
      fetchDirectoryContent(props.path, props.password).then(content => setContent(content))
    }, [props])
  
    return <li className="directory" data-disabled={content === null || content.files.length + content.dirs.length === 0} onClick={clicked}>
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
      if (displayedDir.parents.length === 0) return;

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
      if (displayedDir.children === null || displayedDir.children === undefined) {
        const path = [...displayedDir.parents, displayedDir.name].join('/')
        fetchDirectoryContent(path, props.password).then(content => {
          setDisplayedDir({ ...displayedDir, children: content.dirs })
        })
      }
    }, [displayedDir, props])
  
    return (<>
        <ol className="breadcrumb">
          <li>Dossiers: </li>
        {
        [...displayedDir.parents, displayedDir.name]
          .flatMap((value, i) => i === 0 ? [value] : [' > ', value])
          .map((name, i, ar) => <li key={`${name}${i}`} onClick={i % 2 === 0 && i !== ar.length - 1 ? () => goTo(name) : undefined}>{name === null ? '/' : name}</li>)
        }
      </ol>
      <ul className="directories">
        <li className="directory back" data-disabled={displayedDir.parents.length === 0} onClick={back}>&lt; Retour</li>
        {displayedDir.children != null ? displayedDir.children.map(dirToShow => 
          <Directory 
            path={[ ...displayedDir.parents, displayedDir.name, dirToShow].join('/')} 
            dir={dirToShow} 
            open={() => open(dirToShow)}
            display={() => props.display([ ...displayedDir.parents, displayedDir.name, dirToShow].join('/'))}
            key={dirToShow}
            password={props.password}
          />
        ) : null}
      </ul>
    </>)
}

export default DirectoryList