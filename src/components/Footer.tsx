const LOCALE = "en-DE";

export function Footer() {
    return <div className="footer">
        <div className="build-timestamp">
            Version: {new Date(BUILD_TIMESTAMP).toLocaleString(LOCALE)}
        </div>
        <div className="github-logo">
            <a href="https://github.com/Erkenbend/article-trainer">
                <img src="/github-mark-white.svg" alt="GitHub Logo" width="30px"/>
            </a>
        </div>
    </div>
}
