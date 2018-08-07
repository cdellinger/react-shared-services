import React from 'react';
import {Redirect} from 'react-router-dom'
import Spinner from './spinner';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PageLevelMessage from './page-level-message';
import Authentication from '../authentication.js';

class JoinPage extends React.Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errorMessage: '',
      errorEmail: false,
      errorUserName: false,
      errorPasswords: false,
      redirectToReferrer: false,
      redirectToConfirm: false,      
      showSpinner: false,
      user: {
        userName: '',
        password: '',
        confirmPassword: '',
        email: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  hasUpperCase(str) {
    return (/[A-Z]/.test(str));
  }

  isValidEmail(email){
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  processForm(event) {
    const self = this;
    event.preventDefault();

    self.setState({errorEmail: false, errorUserName: false, errorPasswords: false, errorMessage: ''});
    if (!self.isValidEmail(self.state.user.email)){
      self.setState({errorEmail: true, errorMessage: 'The email address you provided is not in a valid format.'});
    }
    else if (self.state.user.userName.trim() === ''){
      self.setState({errorUserName: true, errorMessage: 'You must provide a user name.'});
    }
    else if (self.state.user.userName.trim().length < 3){
      self.setState({errorUserName: true, errorMessage: 'You must provide a user name of at least 3 characters in length.'});
    }
    else if (self.state.user.password.trim() === '' || self.state.user.confirmPassword.trim() === ''){
      self.setState({errorPasswords: true, errorMessage: 'You must provide a password.'});
    }
    else if (self.state.user.password !== self.state.user.confirmPassword){
      self.setState({errorPasswords: true, errorMessage: 'The two passwords you entered do not match.'});
    }
    else if (self.state.user.password.length < 7){
      self.setState({errorPasswords: true, errorMessage: 'The password you provide must be at least seven characters in length and contain one uppercase character and one special character.'});
    }
    else if (!self.hasUpperCase(self.state.user.password)){
      self.setState({errorPasswords: true, errorMessage: 'The password you provide must be at least seven characters in length and contain one uppercase character and one special character.'});
    }
    else{
      self.setState({showSpinner: true});
      Authentication.join(self.state.user.userName, self.state.user.password, self.state.user.email, function(err, data){
        if (err){
            if (err.message === 'Invalid email address format.'){
              self.setState({errorEmail: true, showSpinner: false, errorMessage: "The email address you provided is not in a valid format."});
            }
            else if (err.message === 'User already exists'){
              self.setState({errorUserName: true, showSpinner: false, errorMessage: "The user name you selected has already been claimed by someone else, please choose a different user name."});
            }
            else{
              self.setState({showSpinner: false, errorEmail: false, errorUserName: false, errorPasswords: false, errorMessage: err.message});
            }
        }
        else{
            self.setState({redirectToConfirm: true});
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
    const self = this;

    const { from } = self.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = self.state;


    let errorEmail = self.state.errorEmail;
    let errorUserName = self.state.errorUserName;
    let errorPasswords = self.state.errorPasswords;
    let errorMessage = self.state.errorMessage;
    
    let errorPageLevel = false;
    let user = self.state.user;

    if (errorMessage !== '' && !errorEmail && !errorUserName && !errorPasswords) errorPageLevel = true;


    const { redirectToConfirm } = this.state;

    if (redirectToReferrer){
      return (
        <Redirect to={from}/>
      )
    }
    else if (redirectToConfirm){
      let confirmRedirect = {};
      confirmRedirect.pathname = '/confirm';
      confirmRedirect.state = {userName: this.state.user.userName};
      return (
        <Redirect to={confirmRedirect}/>
      )
    }
    else if (self.state.showSpinner){
      return (
        <Spinner />
      )
    }
    else{
      return (
        <Card className="joinCard">
          <CardHeader title="Register" subheader="Create a new account for yourself "  />        
            
          <CardContent>
            <div className="form-group">
              {errorEmail === false ? (
                <TextField fullWidth required id="email" label="Email" onChange={self.changeUser} margin="normal" placeholder="Your email address" value={user.email} />
              ):(
                <TextField error helperText={errorMessage} fullWidth required id="email" label="Email" onChange={self.changeUser} margin="normal" placeholder="Your email address" value={user.email} />
              )}
              
              <br/>

              {errorUserName === false ? (
                <TextField fullWidth required id="userName" label="User Name" onChange={self.changeUser} margin="normal" placeholder="Your user name" value={user.userName} />
              ):(
                <TextField error helperText={errorMessage} fullWidth required id="userName" label="User Name" onChange={self.changeUser} margin="normal" placeholder="Your user name" value={user.userName} />
              )}

              <br/>

              {errorPasswords === false ? (
                <TextField fullWidth required id="password" type="password" label="Password" onChange={self.changeUser} margin="normal" placeholder="Your password" value={user.password} />
              ):(
                <TextField error helperText={errorMessage} fullWidth required id="password" type="password" label="Password" onChange={self.changeUser} margin="normal" placeholder="Your password" value={user.password}  />
              )}

              <br/>

              {errorPasswords === false ? (
                <TextField fullWidth required id="confirmPassword" type="password" label="Confirm Password" onChange={self.changeUser} margin="normal" placeholder="Confirm your password" value={user.confirmPassword}  />
              ):(
                <TextField error fullWidth required id="confirmPassword" type="password" label="Confirm Password" onChange={self.changeUser} margin="normal" placeholder="Confirm your password" value={user.confirmPassword}  />
              )}
            </div>
            <PageLevelMessage variant="error" message={errorMessage} showMessage={errorPageLevel}/>
          </CardContent>
          <CardActions>
            <Button type="submit" variant="raised" color="primary" onClick={self.processForm}>Join</Button>
            <Button variant="raised" color="secondary" href="/login">Login</Button>
          </CardActions>
        </Card>
      )
    }
  }
}

export default JoinPage;