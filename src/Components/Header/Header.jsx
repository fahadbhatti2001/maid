import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom } from '@fortawesome/free-solid-svg-icons';

export const Header = (props) => {

    const { position } = props

  return (
    <>
        <div className={"flex justify-center items-end md:h-[16vh] h-[10vh] w-full px-20 " + position}>
            <h1 className="font-PoppinsMedium md:text-5xl text-2xl">
                <FontAwesomeIcon icon={faBroom} />
                Online Maid Finder
            </h1>
        </div>
    </>
  )
}

Header.defaultProps = {
    position: "fixed"
}