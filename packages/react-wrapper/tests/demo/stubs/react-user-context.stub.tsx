import React, { ReactElement, useContext, useState } from 'react'
import { ReactWrapper } from '../../../src'
import { VueUserContext } from './vue-user-context'
import { UserContext } from '../contexts/user-context';
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1000px;
  margin: 0 auto;
  background-color: beige;
  padding: 2rem;
  
`

const Column = styled.div`
  min-width: 400px;
  
`

export function ReactUserContext({...props}): ReactElement {

  const [ userContext, setUserContext ] = useContext(UserContext);
  const [ textBoxState, setTextBoxState ] = useState('')

  const context = {
    user: {
      userContext,
      setUserContext
    }
  }

  function handleTextBoxChange(event) {
    const { value } = event.target
    setTextBoxState(value)
  }
  function updateContextFromReact() {
    setUserContext({
      ...userContext,
      name: {
        first: textBoxState,
        last: userContext.name.last
      }
    })
  }

  const slots = {}
  return (
    <Container>
      <Column>
        <h1>React User Context</h1>
        { userContext && 
          <p>Username: {userContext.name.first} {userContext.name.last}</p>
        }
        <input onChange={handleTextBoxChange} value={textBoxState} type="text" />
        <button onClick={updateContextFromReact}>
          Update First Name from inside React
        </button>
      </Column>
      <Column>
        <ReactWrapper component={VueUserContext as any} context={context} {...slots} {...props} />
      </Column>     
    </Container>
  )
}
