import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

export default class Authentication {

  constructor(){
    console.log('inside constructor of Authentication class');
    //nothing at the moment
  }

  configure(aws_exports){
    Amplify.configure(aws_exports);
  }

  login(userId, password, cb){
    //const self = this;
    Auth.signIn(userId, password)
      .then(user => {
        //self.setState({loggedIn: true});
        return cb(null);
      })
      .catch(err =>{
        console.log(err);
        //self.setState({loggedIn: false});
        return cb(err);
      });
  }


  confirm(userName, confirmationCode, cb){
    Auth.confirmSignUp(userName, confirmationCode)
      .then(data => {
        return cb(null, data);
      })
      .catch(err => {
        return cb(err);
      });
  }

  join(userName, password, email, cb){
      Auth.signUp({username: userName, password: password, attributes: {email: email}})
        .then(data => {
            return cb(null, data);
          })
        .catch(err => {
          return cb(err);
        });

  }
  resendConfirmationCode(userName, cb){
      Auth.resendSignUp(userName)
        .then(data => {
          return cb(null, data);
        })
        .catch(err => {
          return cb(err);
        });
  }

  logout(){
    //const self = this;
    Auth.signOut()
      .then(data => {
        window.location.href = '/';
        //self.setState({loggedIn: false, redirectToHomePage: true})
      })
      .catch(err => alert(err));
  }
}