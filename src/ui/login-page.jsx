import React from 'react';
import {Redirect} from 'react-router-dom'
import Spinner from './spinner';
import PageLevelMessage from './page_level_message';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Authentication from '../authentication.js';

class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errorMessage: '',
      errorUserName: false,
      errorPassword: false,
      redirectToReferrer: false,
      redirectToConfirm: false,
      showSpinner: false,
      user: {
        userName: '',
        password: ''
      },
      snackbarOpen: false
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(event) {
    const self = this;
    event.preventDefault();

    self.setState({errorUserName: false, errorPassword: false, errorMessage: ''});


    if (self.state.user.userName === ''){
      self.setState({errorUserName: true, errorMessage: "You must provide a user name in order to login.", redirectToReferrer: false, showSpinner: false});        
    }
    else if (self.state.user.password === ''){
      self.setState({errorPassword: true, errorMessage: "You must provide a password in order to login.", redirectToReferrer: false, showSpinner: false});              
    }
    else{
      self.setState({showSpinner: true});
      Authentication.login(self.state.user.userName, self.state.user.password, function(err, response){
        if(err === null){
          self.setState({redirectToReferrer: true, showSpinner: false});
          self.props.onLogin();
        }
        else{
          //let loginErrors = {};
          if (err.code === 'UserNotConfirmedException'){
            //loginErrors.message = 'This user account has not been confirmed yet.';
            self.setState({redirectToConfirm: true});
          }
          else{
            self.setState({errorMessage: 'Incorrect user name or password, please try again.', snackbarOpen: true, redirectToReferrer: false, showSpinner: false});        
          }
        }
      });      
    }
  }

  componentDidMount(prevProps, prevState){
  }

  
  changeUser(event) {
    const field = event.target.id;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({user});
  }


  
  render() {
    let self = this;

    let errorMessage = self.state.errorMessage;
    let errorPassword = self.state.errorPassword;
    let errorUserName = self.state.errorUserName;
    let user= self.state.user;
    let showSnackbar = self.state.snackbarOpen;


    const { from } = this.props.location.state || { from: { pathname: '/' } };
    let confirmRedirect = {};
    confirmRedirect.pathname = '/confirm';
    confirmRedirect.state = {userName: this.state.user.userName};
        
    const { redirectToReferrer } = this.state;
    const { redirectToConfirm } = this.state;

    if (redirectToReferrer){
      return (
        <Redirect to={from}/>
      )
    }
    else if (redirectToConfirm){
      return (
        <Redirect to={confirmRedirect}/>
      )
    }
    else if (self.state.showSpinner){
      return(
        <Spinner />
      )
    }
    else{
      return (
        <div>
          <form onSubmit={self.processForm}>
            <br/>
            <Card className="joinCard">
              <CardHeader title="Login" />
              <CardContent>
                <div className="form-group">
                  {errorUserName === false ? (
                    <TextField fullWidth required id="userName" label="User Name" onChange={self.changeUser} margin="normal" placeholder="Your user name" value={user.userName} />
                  ):(
                    <TextField error helperText={errorMessage} fullWidth required id="userName" label="User Name" onChange={self.changeUser} margin="normal" placeholder="Your user name" value={user.userName} />
                  )}
                  
                  <br/>

                  {errorPassword === false ? (
                    <TextField fullWidth required id="password" label="Password" type="password" onChange={self.changeUser} margin="normal" placeholder="Your password" value={user.password} />
                  ):(
                    <TextField error helperText={errorMessage} fullWidth required id="password" label="Password" type="password" onChange={self.changeUser} margin="normal" placeholder="Your password" value={user.password} />
                  )}

                  <br/>
                </div>
              </CardContent>
              <CardActions>
                <Button type="submit" variant="raised" color="primary">Login</Button>
                &nbsp;&nbsp;&nbsp;  
                <Button variant="raised" color="secondary" href="/join">Join</Button>
              </CardActions>
            </Card>
          </form>
          <PageLevelMessage variant="error" message={errorMessage} showMessage={showSnackbar}/>
        </div>
      )
    }
  }
}

export default LoginPage;