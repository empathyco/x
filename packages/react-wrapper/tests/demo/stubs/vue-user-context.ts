import { defineComponent } from '../../../src/vue-creator.utils'


export const VueUserContext = defineComponent({
  inject: ['context'],
  data() {
    return {
      textBoxState: ''
    }
  },
  render(h) {
    const { user: { 
        userContext, 
        setUserContext
      }
    } = this.context || {}

    const getUsername = () => {
      return userContext ? [userContext.name.first, userContext.name.last].join(' ') : 'Loading...'
    }
    return h(
      'div',
      {},
      [
        h(
          'h1',
          {},
          'Vue User Context'),
        h(
          'p',
          {},
          `Username: ${ getUsername() }`
          ),
        h(
          'input',
          {
            attrs: {
              type: 'text'
            },
            on: {
              change: (event) => {
                this.textBoxState = event.target.value
              }
            },
          },
          []
        ),
        h(
          'button',
          {
            on: {
              click: () => {
                setUserContext({
                  ...userContext,
                  name: {
                    first: this.textBoxState,
                    last: userContext.name.last
                  }
                })
              }
            }
          },
          'Update First Name from inside Vue'
        )
      ]
    )
  }
})