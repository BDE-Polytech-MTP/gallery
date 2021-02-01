import './Password.css'
import { fetchDirectoryContent } from './data'
import { useEffect, useState } from 'react'

function Password(props) {

    const [password, setPassword] = useState('')

    useEffect(() => {
        fetchDirectoryContent('', password)
            .then((res) => {
                if (!res.code) {
                    props.onCorrectPassword(password)
                }
            })
    }, [password, props])

    return <div className="passwordPanel">
        <input type="password" value={password} onInput={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
    </div>
}

export default Password