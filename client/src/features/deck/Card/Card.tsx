import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Card from '../../../ui/Card'
import { useDeck } from '../deckSlice'
import CardArrows from './CardArrows'
import CardHeader from './CardHeader'
import CardFront from './CardFront'
import CardBack from './CardBack'

const CardItem = (props: any) => {
  const [previewMode, setPreviewMode] = useState(false)
  const history = useHistory()
  const {
    atSectionEnd,
    activeCard,
    activeCardIndex,
    activeSection,
    setCard,
    setActiveCardFront,
    setActiveCardBack,
    setActiveCardLanguage,
    manageSide,
  } = useDeck()
  const { meta, front, back, side, language } = activeCard
  useEffect(() => {
    const historyState = side === 'back' ? '?back=true' : ''
    history.push({ search: historyState})
  }, [side, history])

  useEffect(() => {
    setPreviewMode(!props.editable)
  }, [props.editable])
  // render the card if it exists...
  return (
    activeCard.uiId ?
      <Card className={'Card-deck-card'} onClick={!props.editable ? manageSide : () => {}}>
        {!props.editable && <CardArrows 
        activeCardIndex={activeCardIndex}
        atSectionEnd={atSectionEnd}
        setCard={setCard}
      />}
      <CardHeader 
        title={activeSection.title}
        activeCardIndex={activeCardIndex}
        editable={props.editable}
        meta={meta}
        side={side}
        language={language}
        togglePreview={() => setPreviewMode(!previewMode)}
        handleSelect={setActiveCardLanguage}
        flip={manageSide}
      />
      {
      side === 'front' ?
        <CardFront 
          front={front}
          language={'markdown'}
          previewMode={previewMode}
          onCodeChange={setActiveCardFront} /> 
        :
        <CardBack 
          language={language}
          back={back}
          previewMode={previewMode}
          onCodeChange={setActiveCardBack} 
      />
      }
    </Card>
    : null
  )
}

export default CardItem