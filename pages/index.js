import { useState, useEffect } from "react"
import Layout from "../components/Layout"

const PIKACHU_HP = 186
const PIKACHU_HEAL_THRESHOLD = 45

/**
 * "max" and "min" are slightly misleading -
 * These values are just the smallest and biggest numbers we care about
 * because anything lower or higher is guaranteed.
 */
const SNORLAX_DEFENSE_MIN = 81
const SNORLAX_DEFENSE_MAX = 88
const SNORLAX_SP_DEF_MIN = 107
const SNORLAX_SP_DEF_MAX = 116

// format is `defense: max iron tail roll`
const SNORLAX_DEFENSE_THRESHOLDS = {
  82: 233,
  83: 230,
  84: 227,
  85: 224,
  86: 222,
}

// format is `spDef: max thunderbolt roll`
const SNORLAX_SP_DEF_THRESHOLDS = {
  115: 220,
  114: 222,
  113: 225,
  112: 226,
  111: 228,
  110: 231,
  109: 232,
  108: 234,
}

// format is `kenya level: volt tackle recoil`
const KENYA_RECOIL_TABLE = {
  29: 27,
  30: 28,
  31: 29,
}

export default function Home() {
  const [lockedIn, setLockedIn] = useState(false)

  const [kenyaLevel, setKenyaLevel] = useState("")
  const [gyaraHp, setGyaraHp] = useState("")
  const [snorlaxHp, setSnorlaxHp] = useState("")
  const [snorlaxDef, setSnorlaxDef] = useState("")
  const [snorlaxSpDef, setSnorlaxSpDef] = useState("")

  const handleKenyaLevel = (e) => setKenyaLevel(e.target.value)
  const handleGyaraHp = (e) => setGyaraHp(e.target.value)
  const handleSnorlaxHp = (e) => setSnorlaxHp(e.target.value)
  const handleSnorlaxDef = (e) => setSnorlaxDef(e.target.value)
  const handleSnorlaxSpDef = (e) => setSnorlaxSpDef(e.target.value)

  const handleSolve = (e) => {
    e.preventDefault()
    setLockedIn(true)
  }

  return (
    <Layout>
      <div className='nes-field'>
        <label htmlFor='kenya-level'>Kenya Level</label>
        <input
          onChange={handleKenyaLevel}
          value={kenyaLevel}
          type='text'
          id='kenya-level'
          className='nes-input'
        />
      </div>
      <div className='nes-field'>
        <label htmlFor='gyarados-hp'>Gyarados HP</label>
        <input
          onChange={handleGyaraHp}
          value={gyaraHp}
          type='text'
          id='gyarados-hp'
          className='nes-input'
        />
      </div>
      <div className='nes-field'>
        <label htmlFor='snorlax-hp'>Snorlax HP</label>
        <input
          onChange={handleSnorlaxHp}
          value={snorlaxHp}
          type='text'
          id='snorlax-hp'
          className='nes-input'
        />
      </div>
      <div className='nes-field'>
        <label htmlFor='snorlax-def'>Snorlax Defense</label>
        <input
          onChange={handleSnorlaxDef}
          value={snorlaxDef}
          type='text'
          id='snorlax-def'
          className='nes-input'
        />
      </div>
      <div className='nes-field'>
        <label htmlFor='snorlax-spdef'>Snorlax Special Defense</label>
        <input
          onChange={handleSnorlaxSpDef}
          value={snorlaxSpDef}
          type='text'
          id='snorlax-spdef'
          className='nes-input'
        />
      </div>
      <button
        onClick={handleSolve}
        type='button'
        className='nes-btn is-success'
      >
        Never Give Up!
      </button>
    </Layout>
  )
}
