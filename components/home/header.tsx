/* eslint-disable @next/next/no-css-tags */
import { Affix, Dropdown, Menu } from 'antd'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { getUserInfo } from '../../lib/util'

const SignIn = styled.li`
  @media screen and (min-width: 700px) {
    position: fixed;
    right: 6em;
  }
`

export default function Header() {
  const router = useRouter()
  const isEvents = /events/i.test(router.pathname)
  const isGallery = /gallery/i.test(router.pathname)
  const isLogin = /login/i.test(router.pathname)
  const isSignUp = /signup/i.test(router.pathname)
  const foreDark = isLogin || isSignUp
  const dark = 'dark-header'
  const light = 'light-header'

  const userInfo = getUserInfo()

  return (
    <>
      <Head>
        <link href="/css/style.css" type="text/css" rel="stylesheet"></link>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
      </Head>

      <div id="header-wrapper" className={foreDark ? dark : light}>
        <Affix
          offsetTop={0}
          onChange={(fixed) => {
            if (foreDark) {
              return
            }
            const ele = document.getElementById('header-wrapper')
            if (!fixed) {
              ele!.className = ele!.className.replace(dark, light)
            } else {
              ele!.className = ele!.className.replace(light, dark)
            }
          }}
        >
          <header id="header">
            <div className="container">
              <Link href="/" passHref>
                <span id="logo" />
              </Link>

              {/* mobile trigger menu */}
              <Dropdown
                trigger={['click']}
                className="menu-trigger"
                overlay={
                  <Menu
                    style={{ fontFamily: 'BebasNeue' }}
                    selectedKeys={[router.pathname.slice(1)]}
                  >
                    <Menu.Item key="events">
                      <Link href="/events">Events</Link>
                    </Menu.Item>
                    <Menu.Item key="gallery">
                      <Link href="/gallery">Gallery</Link>
                    </Menu.Item>

                    {userInfo.role ? (
                      <Menu.Item key="dashboard">
                        <Link href={`/dashboard/${userInfo.role}`}>
                          Dashboard
                        </Link>
                      </Menu.Item>
                    ) : (
                      <Menu.Item key="login">
                        <Link href="/login">Sign in</Link>
                      </Menu.Item>
                    )}
                  </Menu>
                }
              >
                <span></span>
              </Dropdown>

              <nav id="menu">
                <ul>
                  <li className={isEvents ? 'current' : ''}>
                    <Link href="/events">Events</Link>
                  </li>
                </ul>

                <ul>
                  <li className={isGallery ? 'current' : ''}>
                    <Link href="/gallery">Gallery</Link>
                  </li>
                  <SignIn className={isLogin ? 'current' : ''}>
                    {userInfo.role ? (
                      <Link href={`/dashboard/${userInfo.role}`}>
                        Dashboard
                      </Link>
                    ) : (
                      <Link href="/login">Sign in</Link>
                    )}
                  </SignIn>
                </ul>
              </nav>
            </div>
          </header>
        </Affix>
      </div>
    </>
  )
}
