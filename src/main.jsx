import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// Self-hosted fonts (no third-party requests)
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource-variable/figtree/index.css'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)
