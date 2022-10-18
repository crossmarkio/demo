import React from 'react'
import { useState } from 'react'

import { useStoreContext } from '../store/store'

const useModal = (isOpenOnCall:boolean, hasCloseButton:boolean) => {
        const [isOpen, SetIsOpen ] = useState(isOpenOnCall)

        const storeContext = useStoreContext()

        const element = (props:any) => {

            const closeButton = (required:boolean) => {
                return null
            }


            return (
                isOpen 
                    ?   <>
                            <div className={props.className + " modal"}>
                                <div className="modal-wrapper">
                                    <div className="button-wrapper">
                                        {closeButton(hasCloseButton)}
                                    </div>
                                    <header>{props.title}</header>
                                    <div className='content-wrapper'>
                                        {props.children}
                                    </div>
                                </div>
                            </div>
                        </>
                    : null
            )
        }

        const open = () => {
            SetIsOpen(true)
        }

        const close = () => {
            SetIsOpen(false)
        }

    return [ element, open, close, isOpen ]
}

export default useModal;