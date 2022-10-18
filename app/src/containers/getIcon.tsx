
import React, {useState, useRef, useEffect} from 'react';

const getIcon = async (ticker:string, issuer:string, size:number) => {

    let icon;

    return <div 
                style={{
                    backgroundImage:`url(${icon})`,
                    backgroundSize:'cover',
                    backgroundRepeat:'no-repeat',
                    backgroundPosition:'center center',
                    width:size,
                    height:size
                }}>
            </div>
}


export { getIcon }