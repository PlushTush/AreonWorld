import React from 'react';
import './Loader.css'

const Loader = ({size = 'md'}: { size?: 'md' | 'sm' }) => {
    return <span className={`loader ${size}`}></span>
};

export default Loader;