import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { userState } from '../providers/user'
import { Button } from '../components/Button'

const Admin = () => {
  const [user, setUser] = useRecoilState(userState)
  useEffect(() => {
    console.log(user)
  }, [user])
  return (
    <>
      <h2>Products Page</h2>
      <Button label="sasa" size="large" />
    </>
  )
}

export default Admin
