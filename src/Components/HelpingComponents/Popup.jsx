import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';

export const Popup = (props) => {

    const { open, width, close, title, children } = props
    if (!open) return <></>

    return (
        <div className="cst-tr bg-zinc-600 bg-opacity-25 absolute top-0 left-0 z-50 h-screen w-screen p-4">
            <div className="flex h-full w-full">
                <div className={"bg-white rounded m-auto shadow shadow-zinc-300 " + width}>
                    <div className="flex bg-zinc-200 justify-between rounded-t p-3 pl-4 border-b border-zinc-200">
                        <h4 className="text-sm my-auto text-zinc-600 font-poppins font-medium">
                            {title}
                        </h4>
                        <button className="flex" onClick={close} title="Close">
                            <FontAwesomeIcon icon={faXmarkCircle} className="h-4 w-4 text-zinc-400 hover:text-red-500 m-auto" />
                        </button>
                    </div>

                    <div className="p-4 max-h-[80vh] overflow-auto">{children}</div>
                </div>
            </div>
        </div>
    )
}
