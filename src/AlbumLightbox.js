import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox'
import { fetchAlbumImages } from './data'
import { useState, useEffect } from 'react'
import { baseURL } from './settings'

function AlbumLightbox(props) {
    const [urls, setUrls] = useState([])
    const [index, setIndex] = useState(null)

    useEffect(() => {
        fetchAlbumImages(props.name, props.password).then(urls => setUrls(urls.map(url => `${baseURL}/albums/${props.name}/${url}`)))
    }, [props.name, props.password])

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

export default AlbumLightbox