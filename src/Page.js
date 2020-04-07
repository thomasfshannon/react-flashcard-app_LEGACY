import React, { useContext } from 'react'
import ThemeContext from './ThemeContext'

export default function Page(props) {
    const theme = useContext(ThemeContext)
    return (
    <div className={theme === 'dark-mode' ? 'App dark-mode' : 'App'}>{props.children}</div>
    )
}