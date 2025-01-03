import { useState } from 'react'
import { Routers, Route } from 'react-router-dom'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routers>
      <Route path="/" element={<Home />} />
    </Routers>
  )
}

export default App
