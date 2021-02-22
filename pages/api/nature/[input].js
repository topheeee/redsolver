const natures = {
  adamant: '+atk -spAtk',
  bashful: 'neutral',
  bold: '+def -atk',
  brave: '+atk -spd',
  calm: '+spDef -atk',
  careful: '+spDef -spAtk',
  docile: 'neutral',
  gentle: '+spDef -def',
  hardy: 'neutral',
  hasty: '+spd -def',
  impish: '+def -spAtk',
  jolly: '+spd -spAtk',
  lax: '+def -spDef',
  lonely: '+atk -def',
  mild: '+spAtk -def',
  modest: '+spAtk -atk',
  naive: '+spd -spDef',
  naughty: '+atk -spDef',
  quiet: '+spAtk -spd',
  quirky: 'neutral',
  rash: '+spAtk -spDef',
  relaxed: '+def -spd',
  sassy: '+spDef -spd',
  serious: 'neutral',
  timid: '+spd -atk',
}

export default (req, res) => {
  const {
    query: { input },
  } = req

  const nature = natures[input.toLowerCase()]

  res.end(input && nature ? `${input} -> ${nature}` : 'error: invalid nature')
}
