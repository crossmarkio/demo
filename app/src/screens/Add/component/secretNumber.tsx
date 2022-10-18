import React, {
    useState, 
    useRef, 
    useEffect, 
    MouseEventHandler, 
    FocusEventHandler, 
    ReactNode, 
    RefCallback, 
    RefAttributes, 
    RefObject, 
    forwardRef, 
    LegacyRef, 
    ChangeEventHandler, 
    useImperativeHandle} from 'react';

import Input from '../../../components/Input'
import style from '../index.module.scss'

interface IncrementedRef  {
    current: {
        A: HTMLInputElement | null
        B: HTMLInputElement | null
        C: HTMLInputElement | null
        D: HTMLInputElement | null
        E: HTMLInputElement | null
        F: HTMLInputElement | null
        G: HTMLInputElement | null
        H: HTMLInputElement | null
    }
}

const SecretNumber = forwardRef<IncrementedRef>(({}, ref) => {

    useImperativeHandle(ref, () => ({
        current: {
            A: ARef.current,
            B: BRef.current,
            C: CRef.current,
            D: DRef.current,
            E: ERef.current,
            F: FRef.current,
            G: GRef.current,
            H: HRef.current
        }
    }));

    const ARef = useRef<HTMLInputElement>(null)
    const BRef = useRef<HTMLInputElement>(null)
    const CRef = useRef<HTMLInputElement>(null)
    const DRef = useRef<HTMLInputElement>(null)
    const ERef = useRef<HTMLInputElement>(null)
    const FRef = useRef<HTMLInputElement>(null)
    const GRef = useRef<HTMLInputElement>(null)
    const HRef = useRef<HTMLInputElement>(null)

    const handleChange = (e) => {
        //console.log(e.target.value)
    }

    return (
        <div className={style.secretNumberContainer}>       
            <Input
            ref={ARef}
            className={style.numberInput}
            type='secretnumber'
            placeholder='A'
            label='A'
            onChange={handleChange}
            >
            </Input>                                     
        <Input
            ref={BRef}
            className={style.numberInput}
            type='secretnumber'
            placeholder='B'
            label='B'
            onChange={handleChange}
            >
        </Input>
        <Input
            ref={CRef}
            className={style.numberInput}
            type='secretnumber'
            placeholder='C'
            label='C'
            onChange={handleChange}
            >
        </Input>
        <Input
            ref={DRef}
            className={style.numberInput}
            type='secretnumber'
            placeholder='D'
            label='D'
            onChange={handleChange}
            >
        </Input>
        <Input
            ref={ERef}
            className={style.numberInput}
            type='secretnumber'
            placeholder='E'
            label='E'
            onChange={handleChange}
            >
        </Input>
        <Input
            ref={FRef}
            className={style.numberInput}
            type='secretnumber'
            placeholder='F'
            label='F'
            onChange={handleChange}
            >
        </Input>
        <Input
            ref={GRef}
            className={style.numberInput}
            type='secretnumber'
            placeholder='G'
            label='G'
            onChange={handleChange}
            >
        </Input>
        <Input
            ref={HRef}
            className={style.numberInput}
            type='secretnumber'
            placeholder='H'
            label='H'
            onChange={handleChange}
            >
        </Input>
    </div>
    )
})

export default SecretNumber

