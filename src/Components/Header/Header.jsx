import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom } from '@fortawesome/free-solid-svg-icons';

export const Header = (props) => {

    const { position } = props

  return (
    <>
        <div className={"flex md:justify-between justify-center items-center h-[10vh] w-full px-20 " + position}>
            <h1 className="font-PoppinsMediumItalic text-2xl">
                <FontAwesomeIcon icon={faBroom} />
                Maid Finder
            </h1>
        </div>
    </>
  )
}

Header.defaultProps = {
    position: "fixed"
}