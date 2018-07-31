import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
//import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});


class PageLevelMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: props.showMessage
    }
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ showMessage: false });
  }



  render() {
    let self = this;

//function PageLevelMessage(props) {
  //const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[self.props.variant];



  return (
    <Snackbar open={self.state.showMessage} autoHideDuration={6000} onClose={self.handleClose}>
      <SnackbarContent
        className={classNames(self.props.classes[self.props.variant], self.props.className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={self.props.classes.message}>
            <Icon className={classNames(self.props.classes.icon, self.props.classes.iconVariant)} />
            {self.props.message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={self.props.classes.close}
            onClick={self.handleClose}
          >
            <CloseIcon className={self.props.classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
  }
}

PageLevelMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

export default withStyles(styles1)(PageLevelMessage);
