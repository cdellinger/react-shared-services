import React from 'react';
import {Redirect} from 'react-router-dom'
import Spinner from '../components/spinner';
import PageLevelMessage from './page-level-message';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class ConfirmPage extends React.Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      redirectToLogin: false,
      showSpinner: false,
      errorUserName: false,
      errorConfirmationCode: false,
      errorMessage: '',
      showNewConfirmCodeMessage: false,
      user: {
        userName: '',
        code: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.resend = this.resend.bind(this);
  }

  processForm(event) {
    const self = this;
    event.preventDefault();

    self.setState({errorUserName: false, errorConfirmationCode: false, errorMessage: '', showNewConfirmCodeMessage: false, redirectToLogin: false, showSpinner: false});

    if (self.state.user.userName === ''){
      self.setState({errorUserName: true, errorMessage: "You must provide a user name in order to confirm your account."});        
    }
    else if (self.state.user.code === ''){
      self.setState({errorConfirmationCode: true, errorMessage: "You must provide a code"});              
    }
    else{
      self.setState({showSpinner: true});

      self.props.onConfirm(self.state.user.userName, self.state.user.code, function(err, data){
        if (err){
          if (err.message === 'User cannot be confirm. Current status is CONFIRMED'){
            self.setState({showSpinner: false, errorMessage: "This user has already been confirmed."});
          }
          else if (err.code === 'UserNotFoundException'){
            self.setState({showSpinner: false, errorMessage: "Invalid user name or confirmation code, please verify both values."});            
          }
          else{
            self.setState({showSpinner: false, errorMessage: err.message});
          }
        }
        else{
          self.setState({showSpinner: false, redirectToLogin: true});
        }
      });
    }
  }

  componentDidMount(prevProps, prevState){
    const self = this;
    const user = this.state.user;
    if (this.props.location.state !== undefined){
      user.userName = this.props.location.state.userName;
    }
    self.setState({user});
  }

  
  resend(event){
    const self = this;
    event.preventDefault();
    self.setState({errorUserName: false, errorConfirmationCode: false, errorMessage: '', showNewConfirmCodeMessage: false});

    if (self.state.user.userName === ''){
      self.setState({errorUserName: true, errorMessage: "You must provide a user name."});      
    }
    else{
      self.setState({showSpinner: true});    
      self.props.onResend(self.state.user.userName, function(err, data){
        if (err){
          if (err.code === 'UserNotFoundException'){
            self.setState({showSpinner: false, errorUserName: true, errorMessage: 'The user name your provided was not found in our system, please verify you provided the correct value.'});
          }
          else{
            self.setState({showSpinner: false, errorMessage: err.message});
          }
        }
        else{
          self.setState({showSpinner: false, showNewConfirmCodeMessage: true});
        }
      });
    }
  }

  changeUser(event) {
    const field = event.target.id;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({user});
  }
  
  render() {
    let self = this;

    const {user} = self.state;
    const {errorUserName} = self.state;
    const {errorConfirmationCode} = self.state;
    const {errorMessage} = self.state;

    let errorPageLevel = false;
    if (errorMessage !== '' && !errorUserName && !errorConfirmationCode) errorPageLevel = true;

    const { redirectToLogin } = self.state;
    
    if (redirectToLogin){
      return (
        <Redirect to={{pathname: "/login"}} />  
      )
    }
    else if (self.state.showSpinner){
      return(
          <Spinner />
      )
    }
    else{
      return (
        <Card className="confirmCard">
          <CardHeader title="Confirm User" subheader="Enter the confirmation code sent to the email address you specified when registering"  />        
            
          <CardContent>
            <div className="form-group">
              {errorUserName === false ? (
                <TextField fullWidth required id="userName" label="User Name" onChange={self.changeUser} margin="normal" placeholder="Your user name" value={user.userName} />
              ):(
                <TextField error helperText={errorMessage} fullWidth required id="userName" label="User Name" onChange={self.changeUser} margin="normal" placeholder="Your user name" value={user.userName} />
              )}
              <br/>
              {errorConfirmationCode === false ? (
                <TextField fullWidth required id="code" label="Confirmation Code" onChange={self.changeUser} margin="normal" placeholder="Your confirmation code" value={user.code} />
              ):(
                <TextField error helperText={errorMessage} fullWidth required id="code" label="Confirmation Code" onChange={self.changeUser} margin="normal" placeholder="Your confirmation code" value={user.code} />
              )}
            </div>
            <PageLevelMessage variant="error" message={errorMessage} showMessage={errorPageLevel}/>
            <PageLevelMessage variant="success" message={'A new confirmation code has been sent, please check your email.'} showMessage={self.state.showNewConfirmCodeMessage}/>            
          </CardContent>
          <CardActions>
            <Button type="submit" variant="raised" color="primary" onClick={self.processForm}>Confirm</Button>
            <Button variant="raised" color="secondary" onClick={self.resend}>Resend Code</Button>
          </CardActions>
        </Card>
      )
    }
  }

}

export default ConfirmPage;