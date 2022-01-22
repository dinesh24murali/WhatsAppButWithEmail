import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { register, resendVerifyEmail } from 'slices/authSlice';
import Register from 'modules/Auth/Register/Register';

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      register,
      resendVerifyEmail
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
