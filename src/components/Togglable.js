import React, { useState } from 'react'

const Togglable = (props) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisStyle = { display: (visible ? 'none' : '')}
    const showWhenVisStyle = { display: (visible ? '' : 'none')}

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div>
            <div style={hideWhenVisStyle}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisStyle}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    )
}

export default Togglable