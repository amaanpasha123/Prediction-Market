import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient({
  
})
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={()=>{

      }}>
        Singin with solana
      </button>
    </>
  )
}

export default App
