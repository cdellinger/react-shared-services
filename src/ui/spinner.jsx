import React from 'react';
import { RingLoader } from 'react-spinners';
 
class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }
  render() {
    let spinnerSize = 144;
    return (
      <div>
      <div className="spinner-container">
        <div className="spinner-item">
          <RingLoader
            color={'#39ff14'} 
            loading={this.state.loading} 
            size={spinnerSize}
          />
        </div>
      </div>
      </div>  
    )
  }
}

export default Spinner;