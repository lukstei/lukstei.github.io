import React from "react"
import Header from "./header"

const Layout = props => {
    const {children, hideHeader} = props
    return (
        <div className={`site-wrapper`}>
            {!hideHeader && <Header/>}

            <main id="site-main" className="site-main">
                <div id="swup" className="transition-fade">
                    {children}
                </div>
            </main>
            <footer className="site-foot"></footer>
        </div>
    )
}

export default Layout
