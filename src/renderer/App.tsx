import type * as React from 'react'
import { motion } from 'framer-motion'
import TopBar from './components/TopBar'
import LinksForm from './components/LinksForm'
import './App.less'
import 'antd/dist/antd.css'

const containerMotion = {
  initial: 'hidden',
  animate: 'visible',
  variants: {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }
}

function App() {
  return (
    <div className={'app-page'}>
      <TopBar />
      <div className="app-container">
        <motion.div {...containerMotion}>
          <div className="npm-link-form-box">
            <LinksForm />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default App
