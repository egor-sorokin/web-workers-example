import React, {Component} from 'react';
import annyang from 'annyang';


class VoiceAssistant extends Component {
  _initCommands() {
    return {
      'fibonacci': () => this.props.handleFib()
    }
  };

  _enableVoiceAssistant() {
    if (annyang) {
      const commands = this._initCommands();
      annyang.addCommands(commands);
      annyang.start();
    }
  }

  componentDidMount() {
    this._enableVoiceAssistant();
  }

  render() {
    const {children} = this.props;
    return (
      <div className="assistant">
        {children}
      </div>
    );
  }
}


export default VoiceAssistant;
