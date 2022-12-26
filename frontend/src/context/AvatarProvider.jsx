const { createContext, useContext, useState } = require('react')

const AvatarContext = createContext()
const AvatarUpdateContext = createContext()

export function useAvatar() {
  return useContext(AvatarContext)
}

export function useAvatarUpdate() {
  return useContext(AvatarUpdateContext)
}

export function AvatarProvider({ children }) {
  const [avatar, setAvatar] = useState(null)

  function updateAvatar(avatar) {
    if (!avatar) {
      setAvatar(null)

      return
    }

    setAvatar(
      `https://shipping-tracking-app.herokuapp.com/static/${avatar}`
    )
  }

  return (
    <AvatarContext.Provider value={avatar}>
      <AvatarUpdateContext.Provider value={updateAvatar}>
        {children}
      </AvatarUpdateContext.Provider>
    </AvatarContext.Provider>
  )
}
