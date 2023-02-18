import React, { useEffect } from 'react'

export const Spinner = (props) => {
    let { isBlinking = false, isSpinner = false } = props;

    useEffect(() => {
        if (isSpinner) {
            document.getElementsByTagName("body")[0].style = "overflow: hidden";
        } else {
            document.getElementsByTagName("body")[0].style = "";
        }
    }, []);

    return (
        <React.Fragment>
            {isSpinner ? <div className="fixed top-0 left-0 w-full h-full after:content-[''] after:w-full after:h-full after:backdrop-blur-m d bg-black/50 after:absolute after:top-0 outline-none overflow-x-hidden overflow-y-auto z-[999]" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog z-10 justify-center modal-dialog-centered relative w-full pointer-events-none">
                    <div className="flex justify-center items-center">
                        {
                            isBlinking ?
                                <div className="spinner-grow inline-block w-16 h-16 bg-primary-1 rounded-full opacity-0" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div> :
                                <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full text-primary-1" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                        }

                    </div>
                </div>
            </div>
                : ''}

        </React.Fragment>
    )
}