import React, { useState, useEffect} from 'react';

function MyFloatingFilter(props) {

    const { value, api } = props;
    const[summ, setSumm] = useState(value)
  
    useEffect(()=>{
      setSumm(value)
      console.log('rendered')
    }, [value])
  
    console.log("value:", value); 
  
  
    return (
      <div className='ag-wrapper ag-input-wrapper ag-text-field-input-wrapper'>
        <input
          type="text"
          placeholder={value}
          disabled= {true}
          style={{ width: "100%", padding: "4px" }}
          className='ag-input-field-input ag-text-field-input'
        />
      </div>
    );
  }

  export default MyFloatingFilter;