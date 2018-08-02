import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

class Authentication {

  static configure(aws_exports){
    Amplify.configure(aws_exports);
  }


  static login(userId, password, cb){
    Auth.signIn(userId, password)
      .then(user => {
        return cb(null, user);
      })
      .catch(err =>{
        return cb(err);
      });
  }


  static confirm(userName, confirmationCode, cb){
    Auth.confirmSignUp(userName, confirmationCode)
      .then(data => {
        return cb(null, data);
      })
      .catch(err => {
        return cb(err);
      });
  }

  static getCurrentUser(cb){
    Auth.currentAuthenticatedUser()
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err, null);
      });
  }

  static join(userName, password, email, cb){
      Auth.signUp({username: userName, password: password, attributes: {email: email}})
        .then(data => {
            return cb(null, data);
          })
        .catch(err => {
          return cb(err);
        });

  }
  static resendConfirmationCode(userName, cb){
      Auth.resendSignUp(userName)
        .then(data => {
          return cb(null, data);
        })
        .catch(err => {
          return cb(err);
        });
  }

  static logout(cb){
    Auth.signOut()
      .then(data => {
        return cb(null);
      })
      .catch(err => {
        return cb(err);
      })
  }
}
export default Authentication;