import { useState, useEffect } from 'react'
import { Loader } from 'semantic-ui-react'
import Layout from '../components/Layout'

const PIKACHU_HP = 186
const PIKACHU_HEAL_THRESHOLD = 45

const recoil = (hp) => Math.floor(hp / 3)

/**
 * "max" and "min" are slightly misleading -
 * These values are just the smallest and biggest numbers we care about
 * because anything lower or higher is guaranteed.
 */
const SNORLAX_DEFENSE_MIN = 81
const SNORLAX_DEFENSE_MAX = 87 // technically 87 isn't possible, but omitting it would break the code
const SNORLAX_SP_DEF_MIN = 107
const SNORLAX_SP_DEF_MAX = 116
const SNORLAX_GOD_HP = 234

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
  const [content, setContent] = useState('')

  const [kenyaLevel, setKenyaLevel] = useState('')
  const [gyaraCurrentHp, setGyaraCurrentHp] = useState('')
  const [gyaraMaxHp, setGyaraMaxHp] = useState('')
  const [snorlaxHp, setSnorlaxHp] = useState('')
  const [snorlaxDef, setSnorlaxDef] = useState('')
  const [snorlaxSpDef, setSnorlaxSpDef] = useState('')

  const handleKenyaLevel = (e) => setKenyaLevel(e.target.value)
  const handleGyaraCurrentHp = (e) => setGyaraCurrentHp(e.target.value)
  const handleGyaraMaxHp = (e) => setGyaraMaxHp(e.target.value)
  const handleSnorlaxHp = (e) => setSnorlaxHp(e.target.value)
  const handleSnorlaxDef = (e) => setSnorlaxDef(e.target.value)
  const handleSnorlaxSpDef = (e) => setSnorlaxSpDef(e.target.value)

  useEffect(() => {
    if (!lockedIn) return

    // check if we're in iron tail range
    const isIronTailRange =
      // if defense is less than or equal to the "min" then we're in range
      snorlaxDef <= SNORLAX_DEFENSE_MIN ||
      // if hp is less than or equal to max IT roll then we're in range
      snorlaxHp <= SNORLAX_DEFENSE_THRESHOLDS[snorlaxDef]

    // check if we're in thunderbolt range
    const isThunderboltRange =
      // if spDef is less than or equal to the "min" then we're in range
      snorlaxSpDef <= SNORLAX_SP_DEF_MIN ||
      // if hp is less than or equal to max TB roll then we're in range
      snorlaxHp <= SNORLAX_SP_DEF_THRESHOLDS[snorlaxSpDef]

    // volt tackle is only guaranteed if we're out of range for both IT and TB
    const isVoltTackleGuaranteed = !isIronTailRange && !isThunderboltRange

    const snorlaxRecoil = recoil(snorlaxHp)
    const kenyaRecoil = KENYA_RECOIL_TABLE[kenyaLevel]
    const gyaraCurrentRecoil = recoil(gyaraCurrentHp)
    const gyaraMaxRecoil = recoil(gyaraCurrentHp)
    const gyaraHalfRecoil = recoil(gyaraCurrentHp / 2)

    const gyaraAndSnorlaxDoNotPutInHealRange =
      PIKACHU_HP - (gyaraCurrentRecoil + snorlaxRecoil) > PIKACHU_HEAL_THRESHOLD
    const gyaraAndSnorlaxPutInSnorlaxRange =
      PIKACHU_HP - (gyaraCurrentRecoil + snorlaxRecoil) <= snorlaxRecoil
    const kenyaAndSnorlaxWillKill =
      kenyaRecoil + snorlaxRecoil + snorlaxRecoil >= PIKACHU_HP

    const gyaraKenyaAndSnorlaxKill =
      gyaraCurrentRecoil + snorlaxRecoil + kenyaRecoil >= PIKACHU_HP

    const gyaraKenyaAndSnorlaxDoNotPutInHealRange =
      PIKACHU_HP - (gyaraCurrentRecoil + snorlaxRecoil + kenyaRecoil) >
      PIKACHU_HEAL_THRESHOLD

    const gyaraKenyaAndQuilavaDoNotPutInHealRange =
      PIKACHU_HP - (gyaraCurrentRecoil + kenyaRecoil + 20) >
      PIKACHU_HEAL_THRESHOLD

    const gyaraKenyaAndQuilavaPutInSnorlaxRange =
      PIKACHU_HP - (gyaraCurrentRecoil + kenyaRecoil + 18) <= snorlaxRecoil

    const useGyaraKenyaAndQuilava =
      gyaraKenyaAndQuilavaDoNotPutInHealRange &&
      gyaraKenyaAndQuilavaPutInSnorlaxRange

    if (isVoltTackleGuaranteed) {
      // if gyara + 2 snorlax kills pika and doesn't put it in heal range
      if (
        gyaraAndSnorlaxDoNotPutInHealRange &&
        gyaraAndSnorlaxPutInSnorlaxRange
      ) {
        /* 
          lead snorlax, switch to gyara
          send out snorlax, die.
          send out slave, max revive snorlax
          send out snorlax, die
          send out gyara, setup on blastoise
         */
        setContent(
          <p>
            Lead snorlax, switch to gyara
            <br />
            Send out snorlax, max revive gyara
            <br />
            Send out slave, max revive snorlax
            <br />
            Send out snorlax, die
            <br />
            Send out gyara, setup on blastoise
          </p>
        )
      }
      // current gyarados & snorlax will put pikachu in heal range
      else {
        /*
          safer:
            lead snorlax, switch to kenya
            send out snorlax, switch to quilava
            send out snorlax, revive a slave
            send out snorlax, max revive snorlax
            send out snorlax, die
            send out gyarados and setup on blastoise
          faster:
            lead snorlax, switch to gyarados
            send out slave, max revive gyarados
            send out gyarados, switch to slave
            send out snorlax, giga impact to kill
            blastoise kills snorlax
            send out gyarados and setup on blastoise
         */
        setContent(
          <p>
            <u>
              <b>Safer:</b>
            </u>
            <br />
            Lead snorlax, switch to kenya
            <br />
            Send out snorlax, switch to quilava
            <br />
            Send out snorlax, revive a slave
            <br />
            Send out slave, max revive snorlax
            <br />
            Send out snorlax, die.
            <br />
            Send out gyara, setup on blastoise
            <br />
            <br />
            <u>
              <b>Faster:</b>
            </u>
            <br />
            Lead snorlax, switch to gyara
            <br />
            Send out slave, max revive gyara
            <br />
            Send out gyara, switch to slave
            <br />
            Send out snorlax, giga impact
            <br />
            Blastoise kills snorlax
            <br />
            Send out gyara, setup on blastoise
          </p>
        )
      }
    }
    // worst case scenario, glhf <3
    else if (isThunderboltRange) {
      setContent(
        <p>
          You're in Thunderbolt range
          <br />
          <br />
          Use general hope to live and land Giga Impact strats
          <br />
          <br />
          glhf
          <i
            style={{ marginLeft: '4px' }}
            className='nes-icon is-small heart'
          />
        </p>
      )
    }
    // if we're in iron tail range
    // todo: this whole iron tail section could be a lot more predictable
    else if (isIronTailRange) {
      // if current gyarados & snorlax won't put pikachu in heal range
      if (gyaraAndSnorlaxDoNotPutInHealRange) {
        /*
          lead gyarados, die.
          
          if VT:
            send out snorlax, max revive gyarados
            send out slave, max revive snorlax
            send out snorlax, die
            send out gyarados and setup on blastoise

          if TB:
            if kenyaAndSnorlaxWillKill:
              send out snorlax, switch to kenya
              send out snorlax, (max if you have it) revive gyarados
              send out slave, max revive snorlax
              send out snorlax, die
              send out gyarados and setup on blastoise

            else:
              send out snorlax, revive gyarados
              send out slave, max revive snorlax
              send out snorlax, switch to gyarados
              send out snorlax, use crunch (if either def gonna die, rev)
              max revive gyarados as blastoise kills
         */
        setContent(
          <p>
            Lead gyara, die.
            <br />
            <br />
            <u>
              <b>If Volt Tackle:</b>
            </u>
            <br />
            Send out snorlax, switch to slave
            <br />
            Send out snorlax, max revive gyara
            <br />
            Send out slave, max revive snorlax
            <br />
            Send out snorlax, die.
            <br />
            Send out gyara, setup on blastoise
            <br />
            <br />
            <u>
              <b>If Thunderbolt:</b>
            </u>
            <br />
            Send out snorlax, revive gyara
            <br />
            Send out slave, max revive snorlax
            <br />
            Send out snorlax, switch to gyara
            <br />
            Send out snorlax
            <br />
            <br />
            <u>
              <b>If pika or snorlax def gonna die:</b>
            </u>
            <br />
            Max rev gyara
            <br />
            Send out gyara, setup on blastoise
            <br />
            <br />
            <u>
              <b>Otherwise:</b>
            </u>
            <br />
            Use crunch
            <br />
            Max revive gyara, die to blastoise
            <br />
            Send out gyara, setup on blastoise
          </p>
        )
      }
      // snorlax and gyarados will put in heal range
      else {
        /*
          lead gyarados, die

          if VT:
            if gyaradosCurrentRecoil + snorlaxRecoil + kenyaRecoil >= PIKACHU_HP:
              send out snorlax, switch to kenya
              send out snorlax, max revive gyarados
              send out slave, max revive snorlax
              send out snorlax, die
              send out gyarados and setup on blastoise

            else if gyara + kenya + quilava won't put in heal:
              send out snorlax, switch to kenya
              send out snorlax, switch to quilava
              send out snorlax, max revive gyara
              send out gyara, setup on blastoise
            
            else:
              send out snorlax, max revive gyarados
              send out gyarados: x speed, Waterfall
          
          if TB:
            if kenyaAndSnorlaxWillKill:
              send out snorlax, switch to kenya
              send out snorlax, (max) revive gyarados
              send out slave, max revive snorlax
              send out snorlax, die
              send out gyarados and setup on blastoise

            else:
              send out snorlax, revive gyarados
              send out slave, max revive snorlax
              send out snorlax, switch to gyarados
              send out snorlax, crunch (if either def gonna die, rev)
              max revive gyarados as blastoise kills
         */
        setContent(
          <p>
            Lead gyara, die.
            <br />
            <br />
            <u>
              <b>If Volt Tackle:</b>
            </u>
            <br />
            {gyaraKenyaAndSnorlaxKill && (
              <>
                Send out snorlax, switch to kenya
                <br />
                Send out snorlax, max revive gyara
                <br />
                Send out gyara, setup on blastoise
              </>
            )}
            {!gyaraKenyaAndSnorlaxKill && useGyaraKenyaAndQuilava && (
              <>
                Send out snorlax, switch to kenya
                <br />
                Send out snorlax, switch to quilava
                <br />
                Send out snorlax, max revive gyara
                <br />
                Send out gyara, setup on blastoise
              </>
            )}
            {/* I don't think it's possible for the next block to get hit, but just in case */}
            {!gyaraKenyaAndSnorlaxKill && !useGyaraKenyaAndQuilava && (
              <>
                Send out snorlax, max revive gyara
                <br />
                Send out gyara, x speed, waterfall
              </>
            )}
            <br />
            <br />
            <u>
              <b>If Thunderbolt:</b>
            </u>
            <br />
            Send out snorlax, revive gyara
            <br />
            Send out slave, max revive snorlax
            <br />
            Send out snorlax, switch to gyara
            <br />
            Send out snorlax
            <br />
            <br />
            <u>
              <b>If pika or snorlax def gonna die:</b>
            </u>
            <br />
            Max rev gyara
            <br />
            Send out gyara, setup on blastoise
            <br />
            <br />
            <u>
              <b>Otherwise:</b>
            </u>
            <br />
            Use crunch
            <br />
            Max revive gyara, die to blastoise
            <br />
            Send out gyara, setup on blastoise
          </p>
        )
      }
    }
  }, [lockedIn])

  const toggleLockedIn = (e) => {
    e.preventDefault()
    setLockedIn(!lockedIn)
  }

  return (
    <Layout>
      {!lockedIn && (
        <>
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
            <label htmlFor='gyarados-current-hp'>Gyarados Current HP</label>
            <input
              onChange={handleGyaraCurrentHp}
              value={gyaraCurrentHp}
              type='text'
              id='gyarados-current-hp'
              className='nes-input'
            />
          </div>
          <div className='nes-field'>
            <label htmlFor='gyarados-max-hp'>Gyarados Max HP</label>
            <input
              onChange={handleGyaraMaxHp}
              value={gyaraMaxHp}
              type='text'
              id='gyarados-max-hp'
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
            onClick={toggleLockedIn}
            type='button'
            className='nes-btn is-success'
          >
            Solve
          </button>
        </>
      )}
      {lockedIn && content && (
        <>
          {content}
          <button
            onClick={toggleLockedIn}
            type='button'
            className='nes-btn is-warning'
          >
            Reset
          </button>
        </>
      )}
    </Layout>
  )
}
