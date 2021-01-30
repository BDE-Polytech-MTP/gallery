import { baseURL } from './settings'

export function fetchAlbumImages(albumName) {
    return fetch(`${baseURL}/albums/${albumName}`).then(res => res.json()).then(json => json.files)
}
  
export function fetchDirectoryContent(dir) {
    return fetch(`${baseURL}/albums${dir}`).then(res => res.json())
}