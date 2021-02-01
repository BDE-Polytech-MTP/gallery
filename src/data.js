import { baseURL } from './settings'

export function fetchAlbumImages(albumName, password) {
    return fetch(`${baseURL}/albums/${albumName}`, {
        headers: {
            authorization: password
        }
    }).then(res => res.json()).then(json => json.files)
}
  
export function fetchDirectoryContent(dir, password) {
    return fetch(`${baseURL}/albums${dir}`, {
        headers: {
            authorization: password
        }
    }).then(res => res.json())
}